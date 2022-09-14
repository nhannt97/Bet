$(document).ready(() => {
  $('#profileform').submit(function (event) {
    const values = {};
    $(this).serializeArray().forEach(element => {
      values[element.name] = element.value;
    });
    event.preventDefault();
    fetch(window.location.origin + '/api/user/update-profile', { method: 'put', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
      .then(async (response) => {
        const res = await response.json();
        if (response.status === 200) {
          updateUser();
          alert('success');
        } else {
          alert(JSON.stringify(res));
        }
      })
      .then((data) => console.log(data));
  });
  $('#kycform').submit(function (event) {
    const fd = new FormData();
    const values = {};
    $(this).serializeArray().forEach(element => {
      values[element.name] = element.value;
      fd.append([element.name], element.value);
    });
    const frontPic = document.getElementById('frontPic').files[0];
    const backPic = document.getElementById('backPic').files[0];
    fd.append('frontPic', frontPic, frontPic.name);
    fd.append('backPic', backPic, backPic.name);
    event.preventDefault();
    fetch(window.location.origin + '/api/user/update-kyc', { method: 'put', body: fd })
      .then(async (response) => {
        const res = await response.json();
        if (response.status === 200) {
          window.updateUser();
          alert('success');
        } else {
          alert(JSON.stringify(res));
        }
      })
  });
});