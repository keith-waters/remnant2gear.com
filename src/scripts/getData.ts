import fs from 'fs';
import playwright from 'playwright';

async function handler() {

  const baseUrl = 'https://remnant2.wiki.fextralife.com'
  const gearTypes = [
    {
      equipmentType: 'Amulet',
      url: '/Amulets',
    },
    {
      equipmentType: 'Ring',
      url: '/Rings',
    },
    {
      equipmentType: 'Relic',
      url: '/Relics',
    },
    {
      equipmentType: 'Consumable',
      url: '/Consumables',
      descriptionColumn: 2,
    },
    {
      equipmentType: 'Mutator',
      url: '/Mutators',
      descriptionColumn: 2,
    },
    {
      equipmentType: 'Weapon Mods',
      url: '/Weapon+Mods',
    },
    {
      equipmentType: 'Perk',
      url: '/Perks',
    },
    {
      equipmentType: 'Skill',
      url: '/Skills',
      descriptionColumn: 2,
    },
    {
      equipmentType: 'Trait',
      url: '/Traits',
      descriptionColumn: 2,
    },
    {
      equipmentType: 'Relic Fragments',
      url: '/relic+fragments',
      descriptionColumn: 1,
    },
  ]
  const gearData: any[] = []

  await playwright.chromium.launch({ headless: true }).then(async browser => {
    const page = await browser.newPage()
    page.setDefaultTimeout(1000)

    for await (const gearType of gearTypes) {
      await page.goto(baseUrl+gearType.url)
      console.log('going to page..')

      await page.getByText('Table').first().click();

      console.log('Getting the table: ', gearType.equipmentType)
      const rowsNumber = await page.locator('.sortable').locator('tr').count()

      const column = gearType.descriptionColumn ?? 1
      for(let i = 1; i < rowsNumber; i++) {
        const row = page.locator('.sortable').locator('tr').nth(i)
        const data:any = {
          name: (await row.locator('.wiki_link').first().innerText().catch(console.log))?.trim(),
          wikiUrl: await row.locator('.wiki_link').first().getAttribute('href').catch(console.log),
          wikiImageUrl: await row.locator('img').first().getAttribute('src').catch(console.log),
          wikiImageAltText: await row.locator('img').first().getAttribute('alt').catch(console.log),
          descriptionHtml: await row.locator('td').nth(column).innerHTML(),
          equipmentType: gearType.equipmentType,
        }
        if (gearType.equipmentType === 'Mutator') {
          data.mutatorType = await row.locator('td').nth(1).innerHTML()
          data.mutatorMaxLevelBonus = await row.locator('td').nth(3).innerHTML()
        }
        if (gearType.equipmentType === 'Perk') {
          data.perkType = await row.locator('td').nth(1).innerText()
          data.archetype = await row.locator('td').nth(2).innerText()
          data.perkEffect = await row.locator('td').nth(3).innerText()
          data.perkUpgrade1 = await row.locator('td').nth(4).innerText()
          data.perkUpgrade2 = await row.locator('td').nth(5).innerText()
        }
        if (gearType.equipmentType === 'Skill') {
          data.archetype = await row.locator('td').nth(1).innerText()
        }
        if (gearType.equipmentType === 'Trait') {
          data.traitType = await row.locator('td').nth(1).innerText()
          data.traitEffect = await row.locator('td').nth(2).innerText()
          data.traitMaxLevel = await row.locator('td').nth(3).innerText()
        }

        gearData.push(data)
      }
    }
      
    fs.writeFileSync(`./src/data/gear.json`, JSON.stringify(gearData, null, 2))

    await browser.close()
    console.log('All done', Date.now())
  })
}

handler()