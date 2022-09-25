$(document).ready(() => {
  window.closeRoomCodePopup = () => {
    $('#roomcodeform')[0].reset();
    $('#room-code-popup').hide();
  }
  window.closeSubmitPopup = () => {
    $('#submitform')[0].reset();
    $('#submit-popup').hide();
  }
  window.playApi = (roomCode) => {
    fetch(window.location.origin + '/api/challanges/' + window.challangeId + '/play?roomCode=' + roomCode).then(async res => {
      if (res.status === 200) {
        fetchChallanges();
        getWallet();
        window.closeRoomCodePopup();
      } else {
        const result = await res.json();
        alert(JSON.stringify(result));
      }
    });
  }
  window.play = (challangeId) => {
    window.challangeId = challangeId;
    $('#room-code-popup').css('display', 'flex');
  }
  window.submit = (challangeId) => {
    window.challangeId = challangeId;
    $('#submit-popup').css('display', 'flex');
  }
  function fetchChallanges() {
    fetch(window.location.origin + '/api/challanges').then(async (res) => {
      const challanges = await res.json();
      if (res.status === 200) {
        let recent = '';
        let running = '';
        let myRunning = '';
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
              ${challange.roomCode ? `<span class="chip room-code-chip">Room Code: ${challange.roomCode}</span>` : ''}
              ${challange.creator._id === window.user._id || challange.accepter._id === window.user._id ? `<span class="chip submit-chip" onclick="submit('${challange._id}')">Submit</span>` : ''}
            </div>
            <div class="border-bottom"></div>
          `;
            if (challange.status === 'running' && (challange.creator._id === window.user._id || challange.accepter._id === window.user._id)) {
              myRunning += `
            <div class="challange running-challange">
              ${challange.creator.name} <span>vs</span> ${challange.accepter.name} for 
              <span class="chip amount-chip">Rs.${challange.amount}</span>
              <span class="chip game-type-chip">${challange.gameType}</span>
              ${challange.roomCode ? `<span class="chip room-code-chip">Room Code: ${challange.roomCode}</span>` : ''}
              ${challange.creator._id === window.user._id || challange.accepter._id === window.user._id ? `<span class="chip submit-chip" onclick="submit('${challange._id}')">Submit</span>` : ''}
            </div>
            <div class="border-bottom"></div>
          `;
            }
          }
        });
        $('#recent-challanges')[0].innerHTML = recent;
        $('#running-challanges')[0].innerHTML = running;
        $('#my-running-challanges')[0].innerHTML = myRunning;
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
    fetch(window.location.origin + '/api/challanges/new', { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
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
  $('#room-code-popup').hide();
  $('#submit-popup').hide();
  $('#close-room-code-popup').click(() => {
    window.closeRoomCodePopup();
  })
  $('#close-submit-popup').click(() => {
    window.closeSubmitPopup();
  })
  $('#roomcodeform').submit(function (event) {
    const values = {};
    $(this).serializeArray().forEach(element => {
      values[element.name] = element.value;
    });
    event.preventDefault();
    window.playApi(values.roomCode);
  });
  $('#submitform').submit(function (event) {
    const fd = new FormData();
    const values = {};
    $(this).serializeArray().forEach(element => {
      values[element.name] = element.value;
      fd.append([element.name], element.value);
    });
    const pic = document.getElementById('pic').files[0];
    fd.append('pic', pic, pic.name);
    event.preventDefault();
    fetch(window.location.origin + '/api/challanges/' + window.challangeId + '/submit', { method: 'put', body: fd })
      .then(async (response) => {
        const res = await response.json();
        if (response.status === 200) {
          window.closeSubmitPopup();
          alert('success');
        } else {
          alert(JSON.stringify(res));
        }
      })
  });
});