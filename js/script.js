import { cargoList } from '../mock_data/cargoList.js';

$(document).ready(function () {
  const tableBody = $("#data-table tbody");
  const form = $("#form");

  function randomNumber() {
    const number = `CARGO${Math.floor(100 + Math.random() * 900)}`;
    return number;
  }

  function setColor(option) {
    switch (option) {
      case 'Ожидает отправки':
        return 'bg-warning'
      case 'В пути':
        return 'bg-primary text-white'
      case 'Доставлен':
        return 'bg-success text-white'
      default:
        return ''
    }  
  }

  $('#data-table').on('change', 'select.form-select', function () {
    const newColor = $(this).find("option:selected").text();

    $(this).removeClass('bg-warning bg-primary bg-success text-white');
    $(this).addClass(setColor(newColor));
  });

  function updateTable() {
    tableBody.empty();
    cargoList.forEach(item => {
      const cellColor = setColor(item.status);
      const row = `
        <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td class="">
            <select class="form-select ${cellColor}" aria-label="Default">
              <option value="pending" ${item.status === "Ожидает отправки" ? "selected" : ""}>Ожидает отправки</option>
              <option value="inTransit" ${item.status === "В пути" ? "selected" : ""}>В пути</option>
              <option value="delivered" ${item.status === "Доставлен" ? "selected" : ""}>Доставлен</option>
            </select>
          </td>
          <td>${item.origin}</td>
          <td>${item.destination}</td>
          <td>${item.departureDate}</td>
        </tr>
      `;
      tableBody.append(row);
    });
  }

  updateTable();

  form.on("submit", function (event) {
    event.preventDefault(); // Предотвращаем отправку формы

    if (!form[0].checkValidity()) { // Проверяем валидность формы
      event.stopPropagation(); // Останавливаем всплытие события
      $(this).addClass('was-validated');
       $("#selectStatus").removeClass("is-valid")
      return;
    } else {
      $("#selectStatus").removeClass("is-valid")
      const name = $("#inputName").val();
      const origin = $("#inputOrigin").val();
      const destination = $("#inputDestination").val();
      const departureDate = $("#inputDepartureDate").val();
      const status = $("#selectStatus").val();
  
      cargoList.push({ id: randomNumber(), name: name, status: status, origin: origin, destination: destination, departureDate: departureDate });
  
      $(this)[0].reset();
      $(this).removeClass('was-validated');

      $("#modalForCargo").modal("hide");
  
      updateTable();
    }
  });

  $("#modalForCargo").on("hidden.bs.modal", function() {
    form[0].reset()
    form.removeClass('was-validated');
  })

  $("#filters").on("change", function() {
    const value = $(this).val();
    $("#data-table tbody tr").filter(function() {
      const statusText = $(this).find("td:nth-child(3) select").val();

      if (value === 'all') {
        $(this).show();
      } else {
        $(this).toggle(statusText === value);
      }
    });
  });


});
