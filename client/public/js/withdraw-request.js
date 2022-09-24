
$(document).ready(() => {
  window.approveRequest = (transactionId) => {
    fetch(window.location.origin + '/api/transaction/' + transactionId + '/approve', { method: 'put' }).then(async res => {
      if (res.status === 200) {
        fetchRequests();
      } else {
        const result = await res.json();
        alert(JSON.stringify(result));
      }
    });
  }
  window.rejectRequest = (transactionId) => {
    fetch(window.location.origin + '/api/transaction/' + transactionId + '/reject', { method: 'put' }).then(async res => {
      if (res.status === 200) {
        fetchRequests();
        window.getWallet();
      } else {
        const result = await res.json();
        alert(JSON.stringify(result));
      }
    });
  }
 
  function fetchRequests() {
    fetch(window.location.origin + '/api/transaction/get-withdraw-request').then(async (res) => {
      const requests = await res.json();
      if (res.status === 200) {
        let pending = '';
        let success = ''
        let fail = ''
        requests.forEach((request) => {
            const add = `
              <div class="challange recent-challange">
                ${request.user.name} has requested withdraw for 
                <span class="chip amount-chip">Rs.${-request.amount}</span>
                ${request.status === 'pending' ? `
                <span class="chip approve-chip" onClick="approveRequest('${request._id}')">Approve</span>
                <span class="chip reject-chip" onClick="rejectRequest('${request._id}')">Reject</span>
                ` : ''}
              </div>
              <div style="padding-left: 30px;">Account number: ${request.accountNumber}</div>
              <div style="padding-left: 30px;">IFSC Code: ${request.ifscCode}</div>
              <div style="padding-left: 30px;">Holder name: ${request.holderName}</div>
              <div class="border-bottom"></div>
            `;
            if (request.status === 'pending') pending += add;
            if (request.status === 'success') success += add;
            if (request.status === 'fail') fail += add;
            
        });
        $('#p-withdraw-request')[0].innerHTML = pending;
        $('#s-withdraw-request')[0].innerHTML = success;
        $('#f-withdraw-request')[0].innerHTML = fail;
      }
    });
  }
  fetchRequests();
  setInterval(fetchRequests, 2000);
});