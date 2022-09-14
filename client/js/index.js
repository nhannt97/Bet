$(document).ready(() => {
  
  window.play = (challangeId) => {
    fetch(window.location.origin + '/api/challanges/' + challangeId + '/play').then(async res => {
      if (res.status === 200) {
        fetchChallanges();
        getWallet();
      } else {
        const result = await res.json();
        alert(JSON.stringify(result));
      }
    });
  }
  function fetchChallanges() {
    fetch(window.location.origin + '/api/challanges').then(async (res) => {
      const challanges = await res.json();
      if (res.status === 200) {
        let recent = '';
        let running = '';
        challanges.forEach((challange) => {
          if (challange.status === 'new') {
            recent += `
              <div class="challange recent-challange">
                ${challange.creator.name} has set challange for 
                <span class="chip amount-chip">Rs.${challange.amount}</span>
                <span class="chip game-type-chip">${challange.gameType}</span>
                ${window.user._id === challange.creator._id ? '' : `<span class="chip play-chip" onclick="play('${challange._id}')">Play</span>`}
              </div>
              <div class="border-bottom"></div>
            `;
          }
          if (challange.status === 'running') {
            running += `
            <div class="challange running-challange">
              ${challange.creator.name} <span>vs</span> ${challange.accepter.name} for 
              <span class="chip amount-chip">Rs.${challange.amount}</span>
              <span class="chip game-type-chip">${challange.gameType}</span>
            </div>
            <div class="border-bottom"></div>
          `;
          }
        });
        $('#recent-challanges')[0].innerHTML = recent;
        $('#running-challanges')[0].innerHTML = running;
      }
    });
  }
  fetchChallanges();
  setInterval(fetchChallanges, 2000);
  
    $('#challangeform').submit(function (event) {
      const values = {};
      $(this).serializeArray().forEach(element => {
        values[element.name] = element.value;
      });
      if (!values.amount) {
        alert('Amount is required');
        return;
      }
      if (!values.gameType) {
        alert('Game Type is required');
        return;
      }
      event.preventDefault();
      fetch('http://localhost:3000/api/challanges/new', { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
        .then(async (response) => {
            const res = await response.json();
            if (response.status === 201) {
              $('#challangeform')[0].reset();
              fetchChallanges();
              getWallet();
                alert("success");
            } else {
                alert(JSON.stringify(res));
            }
        })
        .then((data) => console.log(data));
    });
  });