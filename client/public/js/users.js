$(document).ready(() => {
  function fetchChallanges() {
    fetch(window.location.origin + '/api/users').then(async (res) => {
      const users = await res.json();
      if (res.status === 200) {
        let list = '';
        users.forEach((user) => {
            list += `
            <tr class="user-row">
              <td class="user-email">${user.email}</td>
              <td class="user-name">${user.name}</td>
              <td class="user-phone">${user.phone}</td>
            </tr>
          `;
        });
        $('#users')[0].innerHTML = list;
      }
    });
  }
  fetchChallanges();
  setInterval(fetchChallanges, 2000);
});