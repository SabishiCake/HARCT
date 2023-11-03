//display date and time
function updateDatetime() {
    const datetimeElement = document.getElementById("datetime");
    const now = new Date();

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];
    
    
    const formattedDatetime = `${
      monthNames[now.getMonth()]
    }-${now.getDate()}-${now.getFullYear()} | ${now.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    })}`;

    datetimeElement.textContent = formattedDatetime;

}
updateDatetime();

setInterval(updateDatetime, 1000);
  