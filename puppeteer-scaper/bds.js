const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteerExtra.use(StealthPlugin());
const fs = require('fs').promises;

const addWaitForTimeout = obj => {
  if (!obj.waitForTimeout) {
    obj.waitForTimeout = ms => new Promise(resolve => setTimeout(resolve, ms));
  }
};

const args = process.argv.slice(2);
const customUrl =
  args.find(arg => arg.startsWith('--url='))?.match(/--url=(.+)/)?.[1] ||
  'https://abc.com/ban-dat-dat-nen-nha-trang-kh?gcn=1.2-ty&cIds=41';
const filereportArg = args.find(arg => arg.startsWith('--filereport='));
const filereport = filereportArg ? filereportArg.split('=')[1] : 'report';
console.log(`Using URL: ${customUrl} - ${filereport}`);

(async () => {
  const browser = await puppeteerExtra.launch({
    headless: false,
    args: ['--start-maximized']
  });
  const page = await browser.newPage();

  const { width, height } = await page.evaluate(() => ({
    width: window.screen.width,
    height: window.screen.height
  }));
  await page.setViewport({ width, height });

  addWaitForTimeout(page);
  await page.goto(customUrl, { waitUntil: 'networkidle2' });

  const scrapedData = [];
  let hasNextPage = true;

  const countNumber = await page.evaluate(() => {
    return document.querySelector('#count-number')?.innerText || '0';
  });
  console.log(`Total listings reported on page: ${countNumber}`);

  let count = 0;

  while (hasNextPage) {
    const pageData = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('.re__card-full').forEach(card => {
        const title = card.querySelector('span.pr-title.js__card-title')?.innerText || 'No title';
        const price =
          card.querySelector('span.re__card-config-price.js__card-config-item')?.innerText || '0';
        const area =
          card.querySelector('span.re__card-config-area.js__card-config-item')?.innerText || '0';
        const district =
          card.querySelector('.re__card-info-content .re__card-location>span')?.innerText ||
          'No district';
        const url = card.querySelector('a')?.href || window.location.href;

        const parsePrice = priceText => {
          const cleanPrice = priceText.replace(/[^\d,]/g, '').replace(',', '.');
          if (priceText.includes('tỷ')) return parseFloat(cleanPrice) * 1000000000;
          if (priceText.includes('triệu')) return parseFloat(cleanPrice) * 1000000;
          return parseFloat(cleanPrice) || 0;
        };

        items.push({
          title,
          district,
          price: parsePrice(price),
          area: parseFloat(area.replace(/[^\d.]/g, '')) || 0,
          url
        });
      });
      return items;
    });

    scrapedData.push(...pageData);
    console.log(`Current page: ${++count}. Total collected: ${scrapedData.length}/${countNumber}`);

    const nextButtonSelector =
      '.re__pagination-group [class*="re__pagination-"]:last-child .re__icon-chevron-right--sm';
    const nextButton = await page.$(nextButtonSelector);

    if (nextButton) {
      console.log('Moving to next page...');
      await page.click('.re__pagination-group [class*="re__pagination-"]:last-child');
      await page.waitForNetworkIdle({ timeout: 10000 });
      await page.waitForTimeout(2000);
    } else {
      console.log('Reached the last page!');
      hasNextPage = false;
    }
  }

  const analyzedData = scrapedData.map((item, index) => ({
    ...item,
    pricePerSqm: item.area > 0 ? item.price / item.area : Infinity,
    index: index + 1
  }));

  const groupedByDistrict = {};
  analyzedData.forEach(item => {
    if (!groupedByDistrict[item.district]) {
      groupedByDistrict[item.district] = [];
    }
    groupedByDistrict[item.district].push(item);
  });

  for (const district in groupedByDistrict) {
    groupedByDistrict[district].sort((a, b) => a.price - b.price);
    groupedByDistrict[district].forEach((item, idx) => (item.index = idx + 1));
  }

  const prices = analyzedData.map(d => d.price).filter(p => p > 0);
  const areas = analyzedData.map(d => d.area).filter(a => a > 0);
  const pricePerSqms = analyzedData.map(d => d.pricePerSqm).filter(p => p !== Infinity);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const avgArea = areas.reduce((a, b) => a + b, 0) / areas.length;
  const avgPricePerSqm = pricePerSqms.reduce((a, b) => a + b, 0) / pricePerSqms.length;
  const medianPricePerSqm = pricePerSqms.sort((a, b) => a - b)[Math.floor(pricePerSqms.length / 2)];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const priceRanges = {
    'Dưới 1 tỷ': 0,
    '1-3 tỷ': 0,
    '3-5 tỷ': 0,
    '5-10 tỷ': 0,
    'Trên 10 tỷ': 0
  };
  prices.forEach(price => {
    if (price < 1e9) priceRanges['Dưới 1 tỷ']++;
    else if (price < 3e9) priceRanges['1-3 tỷ']++;
    else if (price < 5e9) priceRanges['3-5 tỷ']++;
    else if (price < 10e9) priceRanges['5-10 tỷ']++;
    else priceRanges['Trên 10 tỷ']++;
  });

  const districtKeys = Object.keys(groupedByDistrict);
  const pairedDistricts = [];
  for (let i = 0; i < districtKeys.length; i += 2) {
    pairedDistricts.push([districtKeys[i], districtKeys[i + 1] || null]);
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Phân Tích Nhà Đất</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 10px; 
                background-color: #f4f4f9; 
                color: #333; 
            }
            h1 { 
                text-align: center; 
                color: #2c3e50; 
            }
            h2 { 
                color: #2c3e50; 
            }
            .container { 
                margin: 0 auto; 
            }
            .dashboard { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                grid-template-rows: auto auto; 
                gap: 15px; 
                margin-bottom: 5px; 
            }
            .stats { 
                background: #fff; 
                padding: 5px; 
                border-radius: 4px; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
                overflow-y: auto; 
                max-height: 400px; 
            }
            .stats p { 
                margin: 2px 0; 
            }
            .chart-container { 
                background: #fff; 
                padding: 5px; 
                border-radius: 4px; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
                max-height: 400px; 
            }
            canvas { 
                width: 100% !important; 
                height: 100% !important; 
            }
            .tables-section { 
                margin-top: 5px; 
            }
            .district-row { 
                display: flex; 
                gap: 15px; 
                margin-bottom: 15px; 
            }
            .district-section { 
                flex: 1; 
                min-width: 0; 
            }
            .district-section h3 { 
                background: #3498db; 
                color: white; 
                padding: 5px; 
                border-radius: 4px 4px 0 0; 
                margin: 0; 
            }
            .table-wrapper { 
                max-height: 500px; 
                overflow-y: auto; 
                background: #fff; 
                border-radius: 0 0 4px 4px; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
            }
            table { 
                width: 100%; 
                border-collapse: collapse; 
            }
            th, td { 
                padding: 5px; 
                text-align: left; 
                border-bottom: 1px solid #ddd; 
            }
            td {
                font-size: 14px;
            }
            th { 
                background: #2980b9; 
                color: white; 
                position: sticky; 
                top: 0; 
                z-index: 1; 
                cursor: pointer; 
            }
            th:hover { 
                background: #1f6391; 
            }
            tr:nth-child(even) { 
                background: #f9f9f9; 
            }
            tr:hover { 
                background: #e9ecef; 
            }
            a { 
                color: #2980b9; 
                text-decoration: none; 
            }
            a:hover { 
                text-decoration: underline; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Phân Tích Nhà Đất</h1>
            
            <div class="dashboard">
                <div class="stats">
                    <h2>Thống Kê Chính</h2>
                    <p>Tổng số nhà (trên trang): ${countNumber}</p>
                    <p>Tổng số nhà (thu thập): ${analyzedData.length}</p>
                    <p>Giá trung bình: ${avgPrice.toLocaleString()} VND</p>
                    <p>Diện tích trung bình: ${avgArea.toFixed(2)} m²</p>
                    <p>Giá/m² trung bình: ${avgPricePerSqm.toLocaleString()} VND</p>
                    <p>Giá/m² trung vị: ${medianPricePerSqm.toLocaleString()} VND</p>
                    <p>Giá thấp nhất: ${minPrice.toLocaleString()} VND</p>
                    <p>Giá cao nhất: ${maxPrice.toLocaleString()} VND</p>
                </div>
                <div class="chart-container">
                    <canvas id="pricePerSqmChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="priceVsAreaChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="priceRangeChart"></canvas>
                </div>
            </div>
    
            <div class="tables-section">
                <h2>Danh Sách Theo Quận</h2>
                ${pairedDistricts
                  .map(
                    pair => `
                    <div class="district-row">
                        <div class="district-section">
                            <h3>${pair[0]} (${groupedByDistrict[pair[0]].length} căn)</h3>
                            <div class="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th onclick="sortTable(this, 0)">STT</th>
                                            <th onclick="sortTable(this, 1)">Tiêu đề</th>
                                            <th onclick="sortTable(this, 2)">Giá (VND)</th>
                                            <th onclick="sortTable(this, 3)">Diện tích (m²)</th>
                                            <th onclick="sortTable(this, 4)">Giá/m² (VND)</th>
                                            <th>Link</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${groupedByDistrict[pair[0]]
                                          .map(
                                            item => `
                                            <tr>
                                                <td>${item.index}</td>
                                                <td>${item.title}</td>
                                                <td>${item.price.toLocaleString()}</td>
                                                <td>${item.area.toFixed(2)}</td>
                                                <td>${
                                                  item.pricePerSqm === Infinity
                                                    ? 'N/A'
                                                    : item.pricePerSqm.toLocaleString()
                                                }</td>
                                                <td><a href="${
                                                  item.url
                                                }" target="_blank">Xem</a></td>
                                            </tr>
                                        `
                                          )
                                          .join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        ${
                          pair[1]
                            ? `
                            <div class="district-section">
                                <h3>${pair[1]} (${groupedByDistrict[pair[1]].length} căn)</h3>
                                <div class="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th onclick="sortTable(this, 0)">STT</th>
                                                <th onclick="sortTable(this, 1)">Tiêu đề</th>
                                                <th onclick="sortTable(this, 2)">Giá (VND)</th>
                                                <th onclick="sortTable(this, 3)">Diện tích (m²)</th>
                                                <th onclick="sortTable(this, 4)">Giá/m² (VND)</th>
                                                <th>Link</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${groupedByDistrict[pair[1]]
                                              .map(
                                                item => `
                                                <tr>
                                                    <td>${item.index}</td>
                                                    <td>${item.title}</td>
                                                    <td>${item.price.toLocaleString()}</td>
                                                    <td>${item.area.toFixed(2)}</td>
                                                    <td>${
                                                      item.pricePerSqm === Infinity
                                                        ? 'N/A'
                                                        : item.pricePerSqm.toLocaleString()
                                                    }</td>
                                                    <td><a href="${
                                                      item.url
                                                    }" target="_blank">Xem</a></td>
                                                </tr>
                                            `
                                              )
                                              .join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `
                            : '<div class="district-section"></div>'
                        }
                    </div>
                `
                  )
                  .join('')}
            </div>
            <div class="tables-section">
                <h2>JSON</h2>
                <code>${JSON.stringify(groupedByDistrict)}</code>
            </div>
        </div>
    
        <script>
            new Chart(document.getElementById('pricePerSqmChart'), {
                type: 'bar',
                data: {
                    labels: ${JSON.stringify(analyzedData.map(d => d.index))},
                    datasets: [{
                        label: 'Giá/m² (VND)',
                        data: ${JSON.stringify(
                          analyzedData.map(d => (d.pricePerSqm === Infinity ? null : d.pricePerSqm))
                        )},
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: { y: { beginAtZero: true, title: { display: true, text: 'Giá/m²', font: { size: 10 } } } },
                    plugins: { title: { display: true, text: 'Giá/m²', font: { size: 12 } }, legend: { labels: { font: { size: 10 } } } },
                    maintainAspectRatio: false
                }
            });
    
            new Chart(document.getElementById('priceVsAreaChart'), {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Giá vs Diện tích',
                        data: ${JSON.stringify(analyzedData.map(d => ({ x: d.area, y: d.price })))},
                        backgroundColor: 'rgba(231, 76, 60, 0.7)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        pointRadius: 3
                    }]
                },
                options: {
                    scales: {
                        x: { title: { display: true, text: 'Diện tích (m²)', font: { size: 10 } } },
                        y: { title: { display: true, text: 'Giá (VND)', font: { size: 10 } }, beginAtZero: true }
                    },
                    plugins: { title: { display: true, text: 'Giá vs Diện tích', font: { size: 12 } }, legend: { labels: { font: { size: 10 } } } },
                    maintainAspectRatio: false
                }
            });
    
            new Chart(document.getElementById('priceRangeChart'), {
                type: 'pie',
                data: {
                    labels: ${JSON.stringify(Object.keys(priceRanges))},
                    datasets: [{
                        data: ${JSON.stringify(Object.values(priceRanges))},
                        backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6']
                    }]
                },
                options: {
                    plugins: { title: { display: true, text: 'Phân bố Giá', font: { size: 12 } }, legend: { labels: { font: { size: 10 } } } },
                    maintainAspectRatio: false
                }
            });
    
            function sortTable(th, n) {
                const table = th.closest('table');
                let rows, switching = true, i, shouldSwitch, dir = "asc", switchcount = 0;
                while (switching) {
                    switching = false;
                    rows = table.rows;
                    for (i = 1; i < (rows.length - 1); i++) {
                        shouldSwitch = false;
                        const x = rows[i].getElementsByTagName("TD")[n];
                        const y = rows[i + 1].getElementsByTagName("TD")[n];
                        let xVal = x.innerHTML.toLowerCase();
                        let yVal = y.innerHTML.toLowerCase();
                        if (n > 1) {
                            xVal = xVal === 'n/a' ? Infinity : parseFloat(xVal.replace(/,/g, ''));
                            yVal = yVal === 'n/a' ? Infinity : parseFloat(yVal.replace(/,/g, ''));
                        }
                        if (dir === "asc" && xVal > yVal) {
                            shouldSwitch = true;
                            break;
                        } else if (dir === "desc" && xVal < yVal) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    if (shouldSwitch) {
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                        switchcount++;
                    } else if (switchcount === 0 && dir === "asc") {
                        dir = "desc";
                        switching = true;
                    }
                }
            }
        </script>
    </body>
    </html>
        `;

  await fs.writeFile(
    `${filereport}-${new Date().toISOString().replace(/:/g, '_')}.html`,
    htmlContent
  );
  console.log(`Report saved to ${filereport}!`);

  await browser.close();
})();
