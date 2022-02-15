function formattedTime(timestamp) {
  let time = new Date(timestamp);

  let hrs = time.getHours();
  let mins = time.getMinutes();

  let ampm = hrs >= 12 ? "PM" : "AM";
  hrs = hrs % 12;
  hrs = hrs ? hrs : 12;

  if (hrs <= 9) hrs = "0" + hrs;
  if (mins < 10) mins = "0" + mins;

  return hrs + ":" + mins + ` ${ampm}`;
}

export default formattedTime;
