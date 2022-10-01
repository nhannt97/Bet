$(document).ready(() => {
  window.closeRoomCodePopup = () => {
    $('#roomcodeform')[0].reset();
    $('#room-code-popup').hide();
  }
  window.closeSubmitPopup = () => {
    $('#submitform')[0].reset();
    $('#submit-popup').hide();
  }
  window.startApi = (roomCode) => {
    fetch(window.location.origin + '/api/challanges/' + window.challangeId + '/start?roomCode=' + roomCode).then(async res => {
      if (res.status === 200) {
        fetchChallanges();
        window.closeRoomCodePopup();
      } else {
        const result = await res.json();
        alert(JSON.stringify(result));
      }
    });
  }
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
  window.start = (challangeId, creatorId, roomCode) => {
    window.challangeId = challangeId;
    window.creatorId = creatorId;
    if (creatorId === window.user._id) {
      $('#roomCode').removeAttr('disabled');
      $('#submit-room-code').show();
      $('#room-code-popup').css({ display: 'flex' });
    } else {
      if (!roomCode || roomCode === "undefined") {
        alert('wait room code');
        return;
      }
      $('#roomCode').val(roomCode)
      $('#roomCode').attr('disabled', 'true');
      $('#submit-room-code').hide();
      $('#room-code-popup').show({ display: 'flex' });
    }
  }
  window.submit = (challangeId) => {
    window.challangeId = challangeId;
    $('#submit-popup').css('display', 'flex');
  }
  $('#game-type').hide();
  $('#amount').keyup((e) => {
    console.log(e.target.value);
    if (e.target.value) $('#game-type').show();
    else {

      $('#game-type').hide();
      $('#game-type-none').click();
    }
  })
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
<div class="challenge_box_main">
<div class="challenge_box">
             <div class="challange recent-challange">
               <span class="name_box"> <span class="dark_name">CHALLENGE FROM</span> ${challange.creator.name}
                
  <span class="chip game-type-chip">${challange.gameType}</span></span> <br>
<div class="space_name">
<span class="chip amount-chip">Entry Fee :- ${challange.amount}</span>
                ${window.user._id === challange.creator._id ? '' : `<span class="chip play-chip" onclick="play('${challange._id}')">Play</span>`}
</div>              
</div>
              </div><div class="space_below"></div></div>
            `;
          }
          if (challange.status === 'running') {
            running += `
<div class="challenge_box_main">
<div class="challenge_box">
            <div class="challange running-challange">

             <span class="name_box"><span class="dark_name">Match vs</span> ${challange.creator.name} <span>&</span> ${challange.accepter.name} </span>
              
              <span class="chip game-type-chip">${challange.gameType}</span>

<br><div class="space_above"><span class="chip amount-chip">Rs.${challange.amount}</span>
              ${challange.roomCode ? `<span class="chip room-code-chip">Room Code: ${challange.roomCode}</span>` : ''}
              ${!challange.roomCode && challange.accepter._id === window.user._id ? `<span class="chip room-code-chip">Wait for room code</span>` : ''}

              ${!challange.roomCode && challange.creator._id === window.user._id ? `<span class="chip submit-chip" onclick="start('${challange._id}', '${challange.creator._id}', '${challange.roomCode}')">Start now</span>` : ''}
              ${(challange.creator._id === window.user._id || challange.accepter._id === window.user._id) && challange.roomCode ? `<span class="chip submit-chip" onclick="submit('${challange._id}')">Submit</span>` : ''}
</div>            
</div>

           </div><div class="space_below"></div></div>
          `;
            if (challange.status === 'running' && (challange.creator._id === window.user._id || challange.accepter._id === window.user._id)) {
              myRunning += `
<div class="challenge_box_main">
<div class="challenge_box">
            <div class="challange running-challange">
              <span class="dark_name">Match vs</span> ${challange.creator.name} <span> & </span> ${challange.accepter.name} for 
            
              <span class="chip game-type-chip">${challange.gameType}</span><br>
  <span class="chip amount-chip">Rs.${challange.amount}</span>            
  ${challange.roomCode ? `<span class="chip room-code-chip">Room Code: ${challange.roomCode}</span>` : ''}
              ${!challange.roomCode && challange.accepter._id === window.user._id ? `<span class="chip room-code-chip">Wait for room code</span>` : ''}
              ${!challange.roomCode && challange.creator._id === window.user._id ? `<span class="chip submit-chip" onclick="start('${challange._id}', '${challange.creator._id}', '${challange.roomCode}')">Start now</span>` : ''}
              ${(challange.creator._id === window.user._id || challange.accepter._id === window.user._id) && challange.roomCode ? `<span class="chip submit-chip" onclick="submit('${challange._id}')">Submit</span>` : ''}
            </div>
           </div><div class="space_below"></div> </div>
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
          $('#game-type').hide();
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
    window.startApi(values.roomCode);
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