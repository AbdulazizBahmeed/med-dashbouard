let firstPatient = {
  name: "Abdullah",
  code: "A341",
  url: "http://127.0.0.1:3000",
  wait_time: 0,
  regularCheckCount: 0,
  priority: null,
  initial_priority: null,
  heart_rate: 0,
  temperature: 0,
  blood_pressure_up: 0,
  blood_pressure_down: 0,
  o2: 0,
};

let secondPatient = {
  name: "Susan",
  code: "B974",
  url: "http://127.0.0.1:4000",
  wait_time: 0,
  regularCheckCount: 0,
  priority: null,
  heart_rate: 0,
  temperature: 0,
  blood_pressure_up: 0,
  blood_pressure_down: 0,
  o2: 0,
};

let patients = [firstPatient, secondPatient];
//tables
const vitalsTable = document.getElementById("vitalsTable");
const urgentCasesTable = document.getElementById("urgentCasesTable");
//cards
const patientsWaitingCard = document.getElementById("patientsWaitingCard");
const patientsUrgentCasesCard = document.getElementById(
  "patientsUrgentCasesCard"
);
const urgentCasesChangeRateCard = document.getElementById(
  "urgentCasesChangeRateCard"
);
const averageWaitTimeCard = document.getElementById("averageWaitTimeCard");

const firstStaticPatientWaitTime = document.getElementById(
  "firstPatientWaitTime"
);
let firstStaticPatientStartTime = new Date() - 1000 * 45;

const secondStaticPatientWaitTime = document.getElementById(
  "secondPatientWaitTime"
);
let secondStaticPatientStartTime = new Date() - 1000 * 60 * 3;

async function mainLoop() {
  for (let index = 0; index < patients.length; index++) {
    try {
      let response = await fetch(patients[index].url + "/heart-rate");
      let heartRate = await response.text();

      response = await fetch(patients[index].url + "/temperature");
      let temperature = await response.text();

      response = await fetch(patients[index].url + "/blood-pressure-up");
      let bloodPressureUp = await response.text();

      response = await fetch(patients[index].url + "/blood-pressure-down");
      let bloodPressureDown = await response.text();

      response = await fetch(patients[index].url + "/o2");
      let o2 = await response.text();

      if (
        heartRate == 0 &&
        temperature == 0 &&
        bloodPressureUp == 0 &&
        bloodPressureDown == 0 &&
        o2 == 0
      )
        throw new Error();

      //urgent case
      elapsedMinutes = Number(
        calculateWaitTime(patients[index].wait_time).split(":")[1]
      );
      if (
        elapsedMinutes % 1 == 0 &&
        patients[index].regularCheckCount < Math.floor(elapsedMinutes / 1) &&
        patients[index].priority != null
      ) {
        newPriority = decidePriority(patients[index]);
        patients[index].priority = newPriority.indicator;

        if (newPriority.indicator < patients[index].initial_priority) {
          insertOrUpdateUrgentCase(patients[index], newPriority);
        } else {
          removeUrgentCase(patients[index]);
        }
        patients[index].regularCheckCount =
          patients[index].regularCheckCount + 1;
      }
      //end of urgent case

      patients[index].heart_rate = heartRate;
      patients[index].temperature = temperature;
      patients[index].blood_pressure_up = bloodPressureUp;
      patients[index].blood_pressure_down = bloodPressureDown;
      patients[index].o2 = o2;

      if (patients[index].priority == null) {
        patients[index].wait_time = new Date();
        patients[index].priority = decidePriority(patients[index]).indicator;
        patients[index].initial_priority = decidePriority(
          patients[index]
        ).indicator;
        insertPatientRow(patients[index]);
      } else {
        updatePatientRow(patients[index]);
      }
    } catch (error) {
      // throw error;

      patients[index].wait_time = 0;
      patients[index].heart_rate = 0;
      patients[index].temperature = 0;
      patients[index].blood_pressure_up = 0;
      patients[index].blood_pressure_down = 0;
      patients[index].o2 = 0;
      patients[index].priority = null;
      row = document.getElementById(patients[index].name);
      if (row) row.remove();
      removeUrgentCase(patients[index]);
    }
  }
  updateStaticPatients();
  updateCards();
}

function decideHeartRatePriority(heartRate) {
  heartRate = Number(heartRate);

  if (heartRate > 40 && heartRate < 61) return 4;
  else if (heartRate >= 61 && heartRate < 120) return 3;
  else if (heartRate >= 121 && heartRate < 151) return 2;
  else return 1;
}

function decideTemperaturePriority(temperature) {
  temperature = Number(temperature);
  if (temperature >= 36.1 && temperature < 37.2) return 4;
  else if (temperature >= 35 && temperature < 38) return 3;
  else if (temperature >= 38 && temperature < 39.3) return 2;
  else return 1;
}

function decideBloodPressure(BloodPressureUp,BloodPressureDown){
  BloodPressureUp = Number(BloodPressureUp);
  BloodPressureDown = Number(BloodPressureDown);
  if (BloodPressureUp < 90 || BloodPressureDown < 60) return 1;
  else if ((BloodPressureUp >= 90 &&  BloodPressureUp <= 120) || (BloodPressureDown >= 60 && BloodPressureDown <= 79)) return 2;
  else if ((BloodPressureUp >= 120 &&  BloodPressureUp <= 139) || (BloodPressureDown >= 80 && BloodPressureDown <= 89)) return 3;
  else return 1;
}

function decideO2Priority(o2) {
  o2 = Number(o2);
  if (o2 >= 95) return 4;
  else if (o2 >= 92 && o2 < 95) return 3;
  else if (o2 >= 90 && o2 < 92) return 2;
  else return 1;
}

function decidePriority(status) {
  heartRate = decideHeartRatePriority(status.heart_rate);
  temperature = decideTemperaturePriority(status.temperature);
  o2 = decideO2Priority(status.o2);

  result = {
    indicator: heartRate,
    message: "Heart Rate",
  };

  if (temperature < result.indicator) {
    result = {
      indicator: temperature,
      message: "temperature",
    };
  }

  if (o2 < result.indicator) {
    result = {
      indicator: o2,
      message: "oxygen Level",
    };
  }

  return result;
}

function insertPatientRow(status) {
  let priorityColor = bgColor(status.priority);

  let row = document.createElement("tr");
  row.id = status.name;
  row.innerHTML = `   
  <td class="px-5 py-2 border-b border-gray-200 bg-white text-sm text-center">${
    status.name
  }</td>
            <td class="px-5 py-2 border-b border-gray-200 bg-white text-sm text-center">${
              status.code
            }</td>
            <td class="px-4 py-2 border-b border-gray-200 bg-white text-sm text-center">
            <span class="relative inline-block px-2 py-2 font-semibold text-black leading-tight">
                <span id=${
                  status.name
                }-priority-bg aria-hidden class="absolute inset-0 ${priorityColor} opacity-80 rounded-full"></span>
                <span id=${
                  status.name
                }-priority-label class="relative">Priority ${
    status.priority
  }</span>
            </span>
            </td>
            <td id=${
              status.name
            }-wait-time class="px-5 py-2 border-b border-gray-200 bg-white text-sm text-center">${calculateWaitTime(
    status.wait_time
  )}</td>
            <td id=${
              status.name
            }-heart-rate class="px-5 py-2 border-b border-gray-200 bg-white text-sm text-center">${
    status.heart_rate
  } bpm</td>
            <td id=${
              status.name
            }-temperature class="px-5 py-2 border-b border-gray-200 bg-white text-sm text-center">${
    status.temperature
  }°C</td>
            <td id=${
              status.name
            }-blood-pressure class="px-5 py-2 border-b border-gray-200 bg-white text-sm text-center">${
    status.blood_pressure_up
  }/${status.blood_pressure_down} mmHg</td>
            <td id=${
              status.name
            }-o2 class="px-5 py-2 border-b border-gray-200 bg-white text-sm text-center">${
    status.o2
  }%</td>`;
  vitalsTable.prepend(row);
}

function updatePatientRow(status) {
  document.getElementById(status.name + "-wait-time").innerText =
    calculateWaitTime(status.wait_time);

  priorityBg = document.getElementById(status.name + "-priority-bg");
  priorityLabel = document.getElementById(status.name + "-priority-label");
  priorityLabel.innerText = `Priority ${status.priority}`;
  priorityBg.classList.remove(
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-200",
    "bg-green-400"
  );
  priorityBg.classList.add(bgColor(status.priority));

  document.getElementById(
    `${status.name}-heart-rate`
  ).innerText = `${status.heart_rate} bpm`;

  document.getElementById(
    `${status.name}-temperature`
  ).innerText = `${status.temperature} °C`;

  document.getElementById(
    `${status.name}-blood-pressure`
  ).innerText = `${status.blood_pressure_up}/${status.blood_pressure_down} mmHg`;

  document.getElementById(`${status.name}-o2`).innerText = `${status.o2}%`;
}

function insertOrUpdateUrgentCase(status, newPriority) {
  let row = document.getElementById(`${status.name}-urgent-case`);
  if (!row) {
    insertUrgentCaseRow(status, newPriority);
  } else {
    updateUrgentCaseRow(status);
  }
}

function insertUrgentCaseRow(status, newPriority) {
  let initialPriorityColor = bgColor(status.initial_priority);
  let newPriorityColor = bgColor(newPriority.indicator);
  row = document.createElement("tr");
  row.id = `${status.name}-urgent-case`;
  row.innerHTML = `<td class="px-5 py-2 border-b border-gray-200 bg-white text-sm text-center">${status.name}</td>
                      <td class="px-5 py-2 border-b border-gray-200 bg-white text-sm text-center">${status.code}</td>
                      <td class="px-3 py-2 border-b border-gray-200 bg-white text-sm text-center">
                        <span class="relative inline-block px-3 py-1 font-semibold text-black-900 leading-tight">
                        <span id="${status.name}-initial-priority-bg" aria-hidden class="absolute inset-0 ${initialPriorityColor} opacity-80 rounded-full"></span>
                        <span id="${status.name}-initial-priority-label" class="relative">Priority ${status.initial_priority}</span>
                        </span>
                        </td>
                        <td class="px-3 py-2 border-b border-gray-200 bg-white text-sm text-center">
                        <span class="relative inline-block px-3 py-1 font-semibold text-black-900 leading-tight">
                        <span id="${status.name}-current-priority-bg" aria-hidden class="absolute inset-0 ${newPriorityColor} opacity-80 rounded-full"></span>
                        <span id="${status.name}-current-priority-label" class="relative">Priority ${newPriority.indicator}</span>
                        </span>
                      </td>
                      <td
                      id="${status.name}-case-message"
                        class="px-5 py-2 border-b border-gray-200 bg-white text-sm text-center text-red-600 font-bold">
                        ${newPriority.message}
                      </td>`;
  urgentCasesTable.prepend(row);
}

function updateUrgentCaseRow(status) {
  currentPriorityBg = document.getElementById(
    status.name + "-current-priority-bg"
  );
  currentPriorityLabel = document.getElementById(
    status.name + "-current-priority-label"
  );
  currentPriorityLabel.innerText = `Priority ${status.priority}`;
  currentPriorityBg.classList.remove(
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-200",
    "bg-green-400"
  );
  currentPriorityBg.classList.add(bgColor(newPriority.indicator));
}

function removeUrgentCase(status) {
  let row = document.getElementById(`${status.name}-urgent-case`);
  if (row) row.remove();
}

function updateCards() {
  patientsCount =
    patients.filter((patient) => patient.priority != null).length + 2;
  patientsWaitingCard.innerText = patientsCount;

  patientsUrgentCasesCard.innerText = urgentCasesTable.children.length;

  urgentCasesChangeRateCard.innerText = `${Math.floor(
    (urgentCasesTable.children.length / patientsCount) * 100
  )}%`;
  let averageWaitTime =
    (deltaTime(firstPatient.wait_time) +
      deltaTime(secondPatient.wait_time) +
      deltaTime(firstStaticPatientStartTime) +
      deltaTime(secondStaticPatientStartTime)) /
    patientsCount;

  seconds = padZeros(Math.floor(averageWaitTime % 60));
  minutes = padZeros(Math.floor(averageWaitTime / 60));
  averageWaitTimeCard.innerText = `${minutes}:${seconds}`;
}

function updateStaticPatients() {
  firstStaticPatientWaitTime.innerText = calculateWaitTime(
    firstStaticPatientStartTime
  );
  secondStaticPatientWaitTime.innerText = calculateWaitTime(
    secondStaticPatientStartTime
  );
}

function padZeros(num) {
  num = num.toString();
  if (num.length < 2) num = "0" + num;
  return num;
}

function deltaTime(waitTime) {
  if (waitTime == 0) return 0;
  return Math.floor(new Date() - waitTime) / 1000;
}

function calculateWaitTime(waitTime) {
  seconds = padZeros(Math.floor(deltaTime(waitTime)) % 60);
  minutes = padZeros(Math.floor(deltaTime(waitTime) / 60));
  return `${minutes}:${seconds}`;
}

function bgColor(priority) {
  switch (priority) {
    case 1:
      return "bg-red-500";
      break;
    case 2:
      return "bg-orange-400";
      break;
    case 3:
      return "bg-yellow-200";
      break;
    case 4:
      return "bg-green-400";
      break;
  }
}

mainLoop();
setInterval(mainLoop, 1000);
