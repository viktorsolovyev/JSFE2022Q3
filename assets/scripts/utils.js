export function getTimeInUserFormat(timeInSeconds) {

	if (isNaN(timeInSeconds)) {
		return "00:00";	
	}
	let durationTime, h, m, s;

	let date = new Date(timeInSeconds * 1000);
	h = date.getUTCHours();
	m = date.getMinutes();
	s = date.getSeconds();

	h = h < 10 ? `0${h}` : h;
	m = m < 10 ? `0${m}` : m;
	s = s < 10 ? `0${s}` : s;

	if (timeInSeconds >= 3600) durationTime = `${h}:${m}:${s}`;
	else durationTime = `${m}:${s}`;

	return durationTime; 
}

export function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  