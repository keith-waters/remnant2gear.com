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

const getTagGroups = (_gear:string[]) => {
  type Tags = {label: string, key: string, group: string}[]
  let groupName = ''
  let tempTags:Tags = []
  let groupsObject:any = {}

  if (_gear.length > 0) {
    const tags = _gear.slice(_gear.indexOf('begin-tags') + 1)
    tags.forEach(tag => {
      if (groupName !== tag.split('|')[0]) {
        if (groupName.length > 0) {
          groupsObject[groupName] = {
            groupName,
            tags: groupsObject[groupName] ? [...groupsObject[groupName].tags, ...tempTags] : tempTags
          }
        }
        groupName = tag.split('|')[0]
        tempTags = []
      }
      tempTags.push({label: tag.split('|').pop() || 'no label', key: tag.replaceAll('|', '-'), group: tag.split('|')[0]})
    })
  }
  groupsObject[groupName] = {
    groupName,
    tags: groupsObject[groupName] ? [...groupsObject[groupName].tags, ...tempTags] : tempTags
  }
  return groupsObject
}

const getTypes = (gear:any[]) => {
  const type:{groupName: string, tags: any[]} = {
    groupName: 'Type',
    tags: []
  }
  const allTypes = gear.map(g => g.equipmentType)
  const typeStrings = new Set(allTypes)
  typeStrings.forEach(tag => {
    if(tag.length > 0) type.tags.push({label: tag.split('|').pop() || 'no label', key: tag.replaceAll('|', '-'), group: tag.split('|')[0]})
  })
  return type 
}

// gets the full csv from the Google Sheet and converts it to json
export const useGetGearData = () => {  
  const [gear, setGear]:[gear:any[], setGear:Function] = useState([])
  const [groups, setGroups]:[groups:{[key:string]: any}, setGroups:Function] = useState({})

  const handleReadRemoteFile = () => {
    const { readRemoteFile } = usePapaParse();
    const url = process.env.NEXT_PUBLIC_GOOGLE_SHEET ?? ''

    readRemoteFile(url, {
      download: true,
      complete: (results) => {
        const data = convertCSVToJson(results.data as string[][])
        const cleanedData = data.filter(d => d.name)
        const types = getTypes(cleanedData)
        const tags = getTagGroups(results.data[0] as string[])
        const groups = {Type: types, ...tags}
        setGroups(groups)
        setGear(cleanedData)
      },
    });
  };

  useEffect(() => {
    handleReadRemoteFile()
  }, [])

  return {gear, groups}
}