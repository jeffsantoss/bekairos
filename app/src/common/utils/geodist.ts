const toRad = function (value) {
  return (value * Math.PI) / 180
}

//TODO feito provisionamente, o ideal seria utilizar o serviço do google para ser mais exato nos números
export const calculateDistanceBetweenCoordinates = (p1: Coordinates, p2: Coordinates) => {
  const R = 3958.7558657440545 // Radius of earth in Miles
  const dLat = toRad(p2.latitude - p1.latitude)
  const dLon = toRad(p2.longitude - p1.longitude)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(p1.latitude)) * Math.cos(toRad(p2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c

  return {
    miles: d,
    km: d * 1.609344,
    m: d * 1.609344 * 1000
  }
}

interface Coordinates {
  latitude: number
  longitude: number
}
