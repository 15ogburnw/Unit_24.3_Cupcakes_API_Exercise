const BASE_URL = "http://localhost:5000/";

// get all cupcakes from the database, generate their HTML, and append each cupcake to the page
async function showInitialCupcakes() {
  const resp = await axios.get(`${BASE_URL}api/cupcakes`);

  for (let cupcake of resp.data.cupcakes) {
    let newCupcake = $(cupcakeHTML(cupcake));
    $("#cupcakes-list").append(newCupcake);
  }
}

// generate HTML for a cupcake
function cupcakeHTML(cupcake) {
  return `<div class="card col-6 mx-2 my-2" style="width:400px;" data-cupcake-id = "${cupcake.id}">
                <img src="${cupcake.image}" class="card-img-top" alt="" style="height:500px;">
                <div class="card-body">
                    <p class="card-text"><b>Flavor:</b> ${cupcake.flavor}</p>
                    <p class="card-text"><b>Size:</b> ${cupcake.size}</p>
                    <p class="card-text"><b>Rating:</b> ${cupcake.rating}</p>
                    <a href="${BASE_URL}cupcakes/ ${cupcake.id}"><button class="btn btn-danger">Delete</button></a>
                </div>
            </div>`;
}

// Handles form submission for creating a new cupcake.

$("#cupcake-form").on("submit", async function (evt) {
  evt.preventDefault();

  let flavor = $("#flavor").val();
  let size = $("#size").val();
  let rating = $("#rating").val();
  let image = $("#image").val();
  let cupcake = {
    flavor: flavor,
    size: size,
    rating: rating,
    image: image,
  };

  //   Send a post request to the api to add a cupcake to the database
  const resp = await axios.post(`${BASE_URL}api/cupcakes`, cupcake);

  // create HTML for the new cupcake and append it to the page
  let newCupcake = $(cupcakeHTML(resp.data.cupcake));
  $("#cupcakes-list").append(newCupcake);

  //   reset the form data
  $("#cupcake-form").trigger("reset");
});

// Handles click on delete button for each cupcake
$("#cupcakes-list").on("click", "button", async function (evt) {
  evt.preventDefault();

  let $cupcake = $(evt.target).closest("div").parent();
  let cupcakeID = $cupcake.attr("data-cupcake-id");

  //   send a delete request to the api to delete a cupcake from the database
  const resp = await axios.delete(`${BASE_URL}api/cupcakes/${cupcakeID}`);

  //   remove cupcake from the page
  $cupcake.remove();
});

showInitialCupcakes();
