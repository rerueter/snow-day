console.log("usergallery JS connected...");

const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", event => {
  fetch("/api/v1/users/logout", {
    method: "DELETE"
  })
    .then(dataStream => dataStream.json())
    .then(data => {
      if (data.status === 200) {
        window.location = "/";
      } else console.log(data);
    })
    .catch(err => console.log(err));
});

const cardGallery = document.getElementById("cardGallery");

fetch("/api/v1/verify", {
  method: "GET"
})
  .then(response => {
    console.log(response);
    if (response.status === 200) {
      displayUserResorts();
    } else {
      displayErrorMessage();
    }
  })
  .catch(err => console.log(err));

function displayErrorMessage() {
  cardGallery.insertAdjacentHTML(
    "afterbegin",
    `
    <section class="credentials">
      <section class="logoblock">
        <h1>SnowDay<i class="snowflake outline icon"></i></h1>
      </section>
      <div class="ui segment">
        <p>
          You must be logged in to view your personalized list of resorts.
        </p>
      </div>
      <div class="ui two item menu">
        <a class="ui item" href="signup">Sign Up</a>
        <a class="ui item" href="login">Log In</a>
      </div>
    </section>`
  );
}

function displayUserResorts() {
  fetch("/api/v1/users/userResorts", {
    method: "GET",
    headers: {
      credentials: "include"
    }
  })
    .then(dataStream => dataStream.json())
    .then(dataObj => {
      console.log(dataObj);
      console.log(dataObj.data);
      render(dataObj.data);
    })
    .catch(err => console.log(err));
}

function render(resortsArr) {
  resortsArr.map(resort => {
    getTemplate(resort);
  });
}

function getTemplate(resortObj) {
  fetch(`/api/v1/weather/snowdepth/${resortObj.lat}/${resortObj.lng}`, {
     method: 'GET',
     headers: {
       "Content-Type": "application/json",
     }
   })
     .then((snowdepthDataStream) => snowdepthDataStream.json())
     .then((snowdepthDataObj) => {
       console.log(snowdepthDataObj);
       console.log(resortObj);

  const cardTemplate = `
        <div id="${resortObj._id}" class="ui accordion gallery-card">
          <div class="title">
            <div class="ui fluid card">
              <div class="ui content">
                <a class="titleBar header" id="titleBar_${resortObj._id}">
                  <i class="snowflake icon"> </i>${resortObj.name}
                </a>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="resort-info">
              <div class="ui card fluid">
                <div class="content">
                  <a class="ui centered header">
                    <div class="ui tiny horizontal statistic">
                      <div class="value">
                        <span id="temperature_${resortObj._id}">˚</span>
                      </div>
                      <div class="label">
                        Daytime Avg
                      </div>
                    </div>
                    <div class="ui divider"></div>
                    <div class="ui tiny horizontal statistic">
                      <div class="value">
                        <span id="snowdepth_${resortObj._id}">${snowdepthDataObj.response.periods[0].snowDepthIN}"</span>
                      </div>
                      <div class="label">
                        Snow Depth
                      </div>
                    </div>
                  </a>
                  <div class="ui divider"></div>
                  <a class="ui centered header">
                    <div class="ui mini statistic">
                      <div class="value">
                        ${resortObj.lifts}
                      </div>
                      <div class="label">
                        Lifts
                      </div>
                    </div>
                    <div class="ui mini statistic">
                      <div class="value">
                        ${resortObj.runs}
                      </div>
                      <div class="label">
                        Runs
                      </div>
                    </div>
                    <div class="ui mini statistic">
                      <div class="value">
                        ${resortObj.elevation_base}"
                      </div>
                      <div class="label">
                        Base
                      </div>
                    </div>
                    <div class="ui mini statistic">
                      <div class="value">
                        ${resortObj.elevation_summit}"
                      </div>
                      <div class="label">
                        Summit
                      </div>
                    </div>
                  </a>
                </div>
                <div class="content">
                  <div class="ui stackable four item menu">
                    <a class="item" href="${resortObj.mainWebsite}"
                      ><i class="linkify icon"></i>Website</a
                    >
                    <a
                      class="item"
                      href="${resortObj.ticketWebsite}"
                      ><i class="linkify icon"></i>Tickets</a
                    >
                    <a class="item" href="${resortObj.phoneNumber}"
                      ><i class="phone square icon"></i>${resortObj.phoneNumber}</a
                    >
                    <div class="ui item toggle checkbox checked">
                      <input type="checkbox" name="favorite" data-resortid="${resortObj._id}" checked/>
                      <label>Favorite</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  cardGallery.insertAdjacentHTML("beforeend", cardTemplate);

  getAverageTemp(resortObj);

  $(".ui.accordion").accordion("refresh");
  $(".checkbox").checkbox("refresh");
   })
   .catch((err) => console.log(err));
}

function getAverageTemp(resortObj) {
  fetch(`/api/v1/weather/temperature/${resortObj.lat}/${resortObj.lng}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(temperatureDataStream => temperatureDataStream.json())
    .then(temperatureDataObj => {
      console.log(temperatureDataObj);
      let tempSum = 0;
      temperatureDataObj.response[0].periods.forEach(day => {
        tempSum += day.avgTempF;
      });
      const avgTemperature = Math.round(tempSum / 7);
      document
        .getElementById(`temperature_${resortObj._id}`)
        .insertAdjacentHTML("afterbegin", avgTemperature);

      // logic to determine if we should append sun icon
      const snowdepth = document.getElementById(`snowdepth_${resortObj._id}`);
      if (parseInt(snowdepth.innerText) > 20 && avgTemperature < 30) {
        document
          .getElementById(`titleBar_${resortObj._id}`)
          .insertAdjacentHTML(
            "beforeend",
            '<i class="right floated sun outline icon"></i>'
          );
      }
    })
    .catch(err => console.log(err));
}

function removeResort(resortId) {
  fetch(`/api/v1/users/userResorts/${resortId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      credentials: "include"
    }
  })
    .then(updatedUser => updatedUser.json())
    .then(updatedUserObj => {
      console.log(updatedUserObj);
      // $(`#${resortId}`).remove();
    })
    .catch(err => console.log(err));
}

/* Semantic UI  */
$(".ui.accordion").accordion();
$(".checkbox").checkbox("attach events", ".toggle.button");
$(".checkbox").checkbox("attach events", ".check.button", "check");
$(".checkbox").checkbox("attach events", ".uncheck.button", "uncheck");

// $("body").on("click", ".checkbox > label", event => {
//   console.log(event.target);
//   console.log(event.target.previousElementSibling.checked);
//   let targetResortId = event.target.previousElementSibling.dataset.resortid;
//   console.log(targetResortId);

//   // document.getElementById(`modalId`).setAttribute('data-resortid', `${targetResortId}`);

//   // if(event.target.previousElementSibling.checked){
//   //   addResort(targetResortId);
//   // } else {
//   removeResort(targetResortId);
//   // };
// });

// ${snowdepthDataObj.response.periods[0].snowDepthIN}" --- SNOW DEPTH value; removed for testing

// $("body").on("click", ".cancel", () => {
//   $(`#toggleBox_${$('#theModal').data("resort")}`).checkbox("check");
//   $(".ui.modal").modal("hide");
//   // $("");
//   console.log("canceled");
// });

// $("body").on("click", ".approve", () => {
//   $(".ui.modal").modal("hide");
//   removeResort($('#theModal').data("resort"));
//   console.log("approved");
// });

$("body").on("click", ".checkbox", event => {
  const $parent = $(event.target).closest(".gallery-card");
  const $checkbox = $(event.target).closest("label");
  console.log($parent);
  // if (!$checkbox.checked) {
    const $targetResort = $parent.attr("id");
    console.log($targetResort);
    $("#theModal").modal("show");
    $("#theModal").data("resort", $targetResort);
  // }
});

$("body").on("click", ".cancel", () => {
  let $card = $("#theModal").data("resort");
  $(`#${$card} .checkbox`).checkbox("check");
  $(".ui.modal").modal("hide");
});

$("body").on("click", ".approve", () => {
  let $card = $("#theModal").data("resort");
  removeResort($card);
  $(`#${$card}`).remove();
  $(".ui.modal").modal("hide");
});

