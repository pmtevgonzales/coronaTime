module.exports = {
    dateToday
}


function dateToday () {
    let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    let tempDate = new Date();
    let currentDate = `${monthNames[tempDate.getMonth()]} ${tempDate.getDate()}, ${tempDate.getFullYear()} ${tempDate.getHours()}:${tempDate.getMinutes()}:${tempDate.getSeconds()}`;

    return currentDate
}