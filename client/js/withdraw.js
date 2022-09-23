$(document).ready(() => {
    $('#withdrawform').submit(function (event) {
      const values = {};
      $(this).serializeArray().forEach(element => {
        values[element.name] = element.value;
      });
      event.preventDefault();
      fetch(window.location.origin + '/api/transaction/create-withdraw', { method: 'post', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
        .then(async (response) => {
            const res = await response.json();
            if (response.status === 201) {
                console.log(res);
                window.location.pathname = '/transactions'
            } else {
                alert(JSON.stringify(res));
            }
        })
        .then((data) => console.log(data));
    });
  });