//antd 省市数据 组装,create by james  2017年08月16日13:29:07
//这里可以级联到四级
import provinces from 'china-division/dist/provinces.json';
import cities from 'china-division/dist/cities.json';
// import areas from 'china-division/dist/areas.json';

// areas.forEach((area) => {
//   const matchCity = cities.filter(city => city.code === area.parent_code)[0];
//   if (matchCity) {
//     matchCity.children = matchCity.children || [];
//     matchCity.children.push({
//       label: area.name,
//       value: area.code,
//     });
//   }
// });

cities.forEach((city) => {
  const matchProvince = provinces.filter(province => province.code === city.parent_code)[0];
  if (matchProvince) {
    matchProvince.children = matchProvince.children || [];
    matchProvince.children.push({
      label: city.name,
      value: city.code+"00",
      // children: city.children,
    });
  }
});

const options = provinces.map(province => ({
  label: province.name,
  value: province.code+"0000",
  children: province.children,
}));

export default options;