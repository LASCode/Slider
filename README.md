# Slider - модуль ползунка #
### Описание ###
Slider - это удобный jquery плагин ползунка с удобным API и автоматическим адаптивом под ресайз окна.
При разработке упор ставился на стабильность и удобство внедрения в ваши проекты. 
Гибкость в настройке и стилизации прилагается :)

Плагин написан на TypeScript, в разработке по максимуму использованы классы. 
Был использован паттерн MVP(Model-View-Presenter) + стайлгайд AirBnb + БЭМ методология.
### Аналитика ###
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/LASCode/Slider?color=%232ac76b&label=Code%20Size)
![GitHub last commit](https://img.shields.io/github/last-commit/LASCode/Slider?color=%232ac76b&label=Last%20commit)
![GitHub issues](https://img.shields.io/github/issues/LASCode/Slider?color=%232ac76b&label=Issues)

### Демо
- [Demo Page](https://lascode.github.io/Slider/)

### Особенности ###
- Поддерживаются отрицательные и дробные значения
- Поддерживается сенсорное управление элементами стайдера
- Поддержка условно неограниченого количества слайдеров на одной странице без конфликтов
- При использовании API init или update, все передаваемые параметры являются необязательными. Изменяйте только то, что нужно вам.
- При {handleSplit: true}, после того, как один ползунок перейдет "границы" другого, он займет его место, а двигаться вслед за указателем будет уже другой.
- Функция tipsValueFunction позволяет модифицировать выводимые пользователю значения - добавить знаки, провести математические операции.
- Кастомные Id и классы позволяют удобнее переписать стили напрямую, не обращаясь к контейнеру.
- Повторная инициализация на элементе не приведет ни к каким результатам
- После инициализации вы можете получить инстанс слайдера через `.data('JqSlider')` у контейнера.
---

### Использование ###
Предполагается, что вы уже подключили к своей странице JQuery!
1. Подключите к своей странице файлы плагина - js и стили. 
   Где брать файлы?
   - Из папки dist после сборки проекта
   - Из CDN - [Стили](https://cdn.jsdelivr.net/gh/LASCode/Slider@master/dist/slider.css), [Сам плагин](https://cdn.jsdelivr.net/gh/LASCode/Slider@master/dist/slider.js).
2. Создайте на странице контейнер, в который будет помещен слайдер
```
<div class='slider'></div>
```
3. Найдите элемент через Jquery и инициализируйте слайдер
```
$('.slider').JqSlider({type: 'init', options: {...options}})
```

### Опции ###
Опции               | По умолчанию         | Тип       | Описание
:-----              | :----                | :-----:   | :-----:
max                 | 100                  | Number    | Максимальное значение слайдера
min                 | 0                    | Number    | Минимальное значение слайдера
from                | 0                    | Number    | Начальное значение левого ползунка
to                  | 0                    | Number    | Начальное значение правого ползунка
step                | 0                    | Number    | Шаг ползунка
scaleStep           | 0                    | Number    | Шаг шкалы
isRange             | false                | Boolean   | false - один ползунок, true - два ползунка
horizontal          | false                | Boolean   | false - вертикальное расположение, true - горизонтальное расположение
tips                | true                 | Boolean   | false - отключает отображение значений ползунков, true - включает
handleSplit         | true                 | Boolean   | false - запрещает ползункам переходить через друг друга, true - разрещает.
invert              | false                | Boolean   | false - отключает инверсию значений слайдера, true - включает.
customId            | '  '                 | String    | Задает кастомный id слайдеру
scaleStep           | '  '                 | String    | Задает кастомные классы слайдеру
onChangeFunction    | (state) => state     | Function  | Калбек, вызываемый после любого изменения стейта
tipsValueFunction   | (value) => \`${value}`     | Function  | Функция, позволяющая изменить выводящиеся в tips значения

### Api ###
`$('.slider').jqSlider({type: 'init', options: *options*})` - Инициализация плагина. Создает слайдер и перезаписывает настройки по умолчанию. 

`$('.slider').jqSlider({type: 'update', updates: *options*})` - Изменение значений и параметров слайдера. Работает "на горячую".  

`$('.slider').jqSlider({type: 'getState'})` - Возвращает текущий стейт слайдера  




### Развёртывание ###
- Клонирование репозитория
```
git clone https://github.com/LASCode/Slider.git
```
- Установка зависимостей
```
npm install
```
- Запуск сервера разработки
```
npm run serve
```
- Development сборка
```
npm run dev
```
- Production сборка
```
npm run prod
```
- Production сборка (с демо)
```
npm run prodWithDemo
```
- Тесты
```
npm run test
```
- Eslint
```
npm run lint
```
---
### UML диаграмма ###
![UML диаграмма проекта](https://raw.githubusercontent.com/LASCode/Slider/master/UML/JqSliderDiagram.svg)
___
### Зависимости проекта ###
* Jquery



