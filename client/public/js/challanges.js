$(document).ready(() => {
  window.approve = (challangeId) => {
    fetch(window.location.origin + '/api/challanges/' + challangeId + '/approve', { method: 'put' }).then(async res => {
      if (res.status === 200) {
        fetchChallanges();
        getWallet();
      } else {
        const result = await res.json();
        alert(JSON.stringify(result));
      }
    });
  }
  $('#close-submitted-img-popup').click(() => {
    $('#submitted-img-popup').hide();
  })
  window.showSubmittedImage = (url) => {
    $('#submitted-img').attr('src', url);
    $('#submitted-img-popup').css('display', 'flex');
  }
  function fetchChallanges() {
    fetch(window.location.origin + '/api/challanges?status=submitted').then(async (res) => {
      const challanges = await res.json();
      if (res.status === 200) {
        let submitted = '';
        challanges.forEach((challange) => {
            submitted += `
              <div class="challange recent-challange">
                ${challange.submit.winner.name} has submitted winning challange for 
                <span class="chip amount-chip">Rs.${challange.amount}</span>
                <span class="chip game-type-chip">${challange.gameType}</span>
                <span class="chip room-code-chip">${challange.roomCode}</span>
                <span class="chip show-submitted-img-chip" onClick="showSubmittedImage('${window.location.origin}/api/challanges/${challange._id}/submitted-pic')">Show Submitted Image</span>
                <span class="chip approve-chip" onClick="approve('${challange._id}')">Approve</span>
              </div>
              <div class="border-bottom"></div>
            `;
        });
        $('#submitted-challanges')[0].innerHTML = submitted;
      }
    });
  }
  fetchChallanges();
  setInterval(fetchChallanges, 2000);
  $('#refresh').click(() => {
    fetchChallanges();
  });
  $('#submitted-img-popup').hide();

});