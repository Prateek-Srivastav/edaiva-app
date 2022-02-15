export const formattedDate = (timestamp) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  let formattedDate;
  formattedDate = new Date(timestamp);
  const date = formattedDate.getDate();
  const month = monthNames[formattedDate.getMonth()];

  formattedDate = month + " " + date + ", " + formattedDate.getFullYear();

  return formattedDate;
};

export const formattedNumericDate = (timestamp) => {
  if (timestamp === "") return;
  let formattedNumeriDate;
  formattedNumeriDate = new Date(timestamp);

  let day = formattedNumeriDate.getDate();
  let month = formattedNumeriDate.getMonth() + 1;

  if (day <= 9) day = "0" + day;
  if (month < 10) month = "0" + month;

  const date = day + "/" + month + "/" + formattedNumeriDate.getFullYear();
  return date;
};
