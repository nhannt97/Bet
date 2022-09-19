$(document).ready(() => {
  $('#welcome-popup').show();
  $('#close-welcome-popup').click(() => {
      $('#welcome-popup').hide();
  })
  $('#subscribeform').submit(function (event) {
      const values = {};
      $(this).serializeArray().forEach(element => {
          values[element.name] = element.value;
      });
      event.preventDefault();
      fetch(window.location.origin + '/api/subscribe', { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
          .then(async (response) => {
              const res = await response.json();
              if (response.status === 201) {
                  console.log(res);
                  $('#welcome-popup').hide();
              } else {
                  alert(JSON.stringify(res));
              }
          })
          .then((data) => console.log(data));
  });
})