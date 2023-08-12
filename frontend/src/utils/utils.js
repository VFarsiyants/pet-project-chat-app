export function convertTime(datetimeStr) {
  return new Date(datetimeStr)
    .toLocaleTimeString('en-US',
    {hour12:true, hour:'numeric', minute:'numeric'}
    );
}
