function handleSubmit(e) {
  e.preventDefault();
  const form = document.querySelector("form");
  const formData = new FormData(form);
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }

  console.log(data);
  fetch("/add_student", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Student added successfully");
      } else {
        alert("Error adding student");
      }
    });
}
