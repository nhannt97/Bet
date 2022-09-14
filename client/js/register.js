$(document).ready(() => {
    $('#registerform').submit(function (event) {
      const values = {};
      $(this).serializeArray().forEach(element => {
        values[element.name] = element.value;
      });
      event.preventDefault();
      fetch('http://localhost:3000/api/register', { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
        .then(async (response) => {
            const res = await response.json();
            if (response.status === 201) {
                console.log(res);
                alert('success');
                window.location.pathname = '/login'
            } else {
                alert(JSON.stringify(res));
            }
        })
        .then((data) => console.log(data));
    });
  });