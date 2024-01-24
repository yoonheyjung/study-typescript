export default {
  formatDate: (timestamp?: string, includeTime: boolean = false) => {
    const currentDate = timestamp ? new Date(timestamp) : new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");

    let formattedDate = `${year}-${month}-${day}`;

    if (includeTime) {
      const hours = currentDate.getHours().toString().padStart(2, "0");
      const minutes = currentDate.getMinutes().toString().padStart(2, "0");
      formattedDate += ` ${hours}:${minutes}`;
    }

    return formattedDate;
  },
};
