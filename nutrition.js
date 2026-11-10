// Typical product values per 100 g/ml; eggs are per piece (~50 g edible part).
// These are estimates, not package-specific measurements.
const foods={
 'Куриная грудка':[120,22.5,2.6,0],'Сливки без лактозы':[206,2.5,20,3.5],'Сыр':[350,25,27,0],
 'Макароны сухие':[350,12,1.5,72],'Говядина':[190,20,12,0],'Картофель':[77,2,0.1,17],
 'Морковь':[41,0.9,0.2,10],'Томатная паста':[82,4.3,0.5,19],'Молоко без лактозы':[52,3,2.5,4.7],
 'Масло сливочное':[748,0.5,82.5,0.8],'Масло растительное':[900,0,100,0],'Фарш говяжий':[215,19,15,0],
 'Томаты протёртые':[30,1.4,0.2,5],'Творог без лактозы':[121,17,5,1.8],'Помидоры':[18,0.9,0.2,3.9],
 'Яйца':[72,6.3,4.8,0.4],'Рис сухой':[360,7,1,79],'Фасоль стручковая':[31,1.8,0.2,7],
 'Томаты вяленые':[213,5,14,19],'Фасоль консервированная':[100,6,0.5,16],'Кукуруза консервированная':[80,2.5,1,14],
 'Перец сладкий':[31,1,0.3,6],'Авокадо':[160,2,14.7,8.5],'Хлеб':[250,8,3,47],
 'Рыба слабосолёная':[200,21,13,0],'Лаваш':[275,9,1.2,56],'Курица готовая':[165,31,3.6,0],
 'Мука':[364,10,1,76],'Сахар':[400,0,0,100],'Овсяные хлопья':[370,13,7,62],
 'Какао':[300,24,15,10],'Семена чиа':[486,17,31,42],'Хек':[86,17,2.2,0],
 'Кабачок':[24,0.6,0.3,4.6],'Йогурт без лактозы':[65,4,3,5.5],'Клубника':[32,0.7,0.3,7.7],
 'Шоколад':[550,6,35,52],'Огурцы':[15,0.7,0.1,3.6]
};
export const nutrientKeys=['kcal','protein','fat','carbs'];
export function validNutrition(n){return !!n&&Number.isFinite(n.kcal)&&n.kcal>=0&&n.kcal<=20000&&nutrientKeys.slice(1).every(k=>n[k]===null||(Number.isFinite(n[k])&&n[k]>=0&&n[k]<=2000))&&typeof n.estimated==='boolean';}
export function recipeNutrition(r){
 if(r.nutrition)return r.nutrition;
 const sum=[0,0,0,0];
 for(const i of r.ingredients){const row=foods[i.name];if(!row||!['г','мл','шт'].includes(i.unit)||i.unit==='шт'&&i.name!=='Яйца'||i.name==='Яйца'&&i.unit!=='шт')return null;const factor=i.qty/(i.unit==='шт'?1:100);row.forEach((v,n)=>sum[n]+=v*factor);}
 return Object.fromEntries([...nutrientKeys.map((k,n)=>[k,Math.round(sum[n]*10)/10]),['estimated',true]]);
}
export function scaleNutrition(n,servings=1){return n?{...Object.fromEntries(nutrientKeys.map(k=>[k,n[k]===null?null:Math.round(n[k]*servings*10)/10])),estimated:n.estimated}:null;}
export function sumNutrition(items){const total={kcal:0,protein:0,fat:0,carbs:0,unknown:0,partial:false};for(const n of items){if(!n){total.unknown++;continue;}for(const k of nutrientKeys){if(n[k]===null)total.partial=true;else total[k]+=n[k];}}return total;}
export function validFoodLog(log){return Array.isArray(log)&&log.length<=10000&&new Set(log.map(x=>x.id)).size===log.length&&log.every(x=>typeof x.id==='string'&&x.id.length<=100&&typeof x.name==='string'&&x.name.length>0&&x.name.length<=100&&/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&Number.isFinite(x.servings)&&x.servings>0&&x.servings<=100&&(x.nutrition===null||validNutrition(x.nutrition))&&(!x.mealId||typeof x.mealId==='string'&&x.mealId.length<=100));}
export function validSavedFoods(list){return Array.isArray(list)&&list.length<=1000&&new Set(list.map(x=>x.id)).size===list.length&&list.every(x=>typeof x.id==='string'&&x.id.length>0&&x.id.length<=100&&typeof x.name==='string'&&x.name.length>0&&x.name.length<=100&&['portion','100'].includes(x.basis)&&validNutrition(x.nutrition));}
