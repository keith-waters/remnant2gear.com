import { useState, useEffect } from "react";
import { usePapaParse } from 'react-papaparse';

const convertCSVToJson = (lines: string[][]) => {
  const headers: string[] = lines[0].map(l => l.replaceAll('|', '-'));
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj:any = {};
    const currentLine = lines[i];

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = currentLine[j].trim();
    }

    result.push(obj);
  }

  return result;
};

const getGearTags = (_gear:string[]) => {
  const gearTags:{label: string, key: string}[] = []
  if (_gear.length > 0) {
    _gear.slice(_gear.indexOf('begin-tags') + 1).forEach(g => {
      gearTags.push({label: g, key: g.replaceAll('|', '-')})
    })
  }
  return gearTags
}

// gets the full csv from the Google Sheet and converts it to json
export const useGetGearData = () => {  
  const [gear, setGear]:[gear:any[], setGear:Function] = useState([])
  const [gearTags, setGearTags]:[gearTags:string[], setGearTags:Function] = useState([])

  const handleReadRemoteFile = () => {
    const { readRemoteFile } = usePapaParse();
    const url = process.env.NEXT_PUBLIC_GOOGLE_SHEET ?? ''

    readRemoteFile(url, {
      download: true,
      complete: (results) => {

        setGearTags(getGearTags(results.data[0] as string[]))

        const data = convertCSVToJson(results.data as string[][])
        const cleanedData = data.filter(d => d.name)
        setGear(cleanedData)
      },
    });
  };

  useEffect(() => {
    handleReadRemoteFile()
  }, [])

  return [gear, gearTags]
}