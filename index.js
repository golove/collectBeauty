
async function init() {
    let data = await loadData();
    const modal = document.getElementById('modal');
   
    const app = document.getElementById('app');

    const containerWidth = app.clientWidth;
    // console.log(containerWidth)
    // const cols = 4;
    // const cardWidth = (containerWidth-gap*(cols+1)) / cols;
    const gap = 6;
    const cardWidth = 200;
    const cols = Math.floor(containerWidth / (cardWidth + gap));
    const mrLeft = (containerWidth - (cols * (cardWidth + gap) - gap)) / 2;

    const dataArray = generateTwoDimensionalArray(data, cols, cardWidth, mrLeft, gap,(item)=>{return (cardWidth / item.srcs[0].aspect_ratio) + gap})

    function cardNodeList(){
        const cardNodeList = [];
        dataArray.forEach(items => {
        items.forEach(item => {
           const card = createCard(item, cardWidth,true)
           card.addEventListener('click',()=>{
            const modalClose = document.createElement('div')
            modalClose.setAttribute('id','modal-close') //
            modalClose.style.position = 'absolute'
            modalClose.style.top = '0'
            modalClose.style.right = '0'
            modalClose.style.zIndex = '10'
             modalClose.innerText = 'Close'
             modal.append(modalClose)
            // modal.style.height = '100%'
            modal.style.display = 'block'
            const imgNodeList = []
            imgArray = generateTwoDimensionalArray(item.srcs, cols, cardWidth, mrLeft, gap,(e)=>{return (cardWidth / e.aspect_ratio) + gap})
            imgArray.forEach(imgs => {
                imgs.forEach(arr => {
                    const img = createCard(arr, cardWidth,false)
                    imgNodeList.push(img)
                })
            
            })
           modal.append(...imgNodeList)
           modalClose.addEventListener('click',()=>{
            // modal.style.height = '0'
            modal.style.display = 'none'
            modal.innerHTML = ''
           })
           // 判断app有滚动操作
           window.addEventListener('scroll',()=>{
                modal.style.display = 'none'
               modal.innerHTML = ''
           })

           window.addEventListener('resize',()=>{
               debounce(appResize(imgNodeList),300)
           })
          
        })
           cardNodeList.push(card)
         })

        })
        return cardNodeList
    }
    const cards = cardNodeList();
    app.append(...cards)

    window.addEventListener('resize', ()=>{debounce(appResize(cards),300)})
}

function appResize(nodeList){
    // const nodeList = document.querySelectorAll('.card');
    const app = document.getElementById('app');
    const containerWidth = app.clientWidth;
    const gap = 6;
    const cardWidth = 200;
    const cols = Math.floor(containerWidth / (cardWidth + gap));
    const mrLeft = (containerWidth - (cols * (cardWidth + gap) - gap)) / 2;
    updateCardPosition(nodeList, cols, cardWidth, mrLeft, gap)

}


function updateCardPosition(cards, cols, cardWidth, mrLeft, gap) {
    const newArray = new Array(cols).fill(0);
    // const dataArray = new Array(cols).fill(null).map(() => []);
    let minIndex = 0;
    let minHeight = newArray[0];  // 初始最小高度

    for (let i = 0; i < cards.length; i++) {
            cards[i].style.top = newArray[minIndex] + 'px';
            cards[i].style.left = (cardWidth * minIndex + gap * (minIndex + 1)) + mrLeft + 'px';
        // 更新 newArray[minIndex] 的高度
        // newArray[minIndex] += (cardWidth / array[i].srcs[0].aspect_ratio) + gap;
        newArray[minIndex] += cards[i].offsetHeight + gap;
        // 查找下一个最小高度和对应的索引
        minHeight = newArray[minIndex];
        for (let j = 0; j < cols; j++) {
            if (newArray[j] < minHeight) {
                minHeight = newArray[j];
                minIndex = j;
            }
        }
    }
}

function generateTwoDimensionalArray(array, cols, cardWidth, mrLeft, gap, heightFunc) {
    const newArray = new Array(cols).fill(gap);
    const dataArray = new Array(cols).fill(null).map(() => []);
    let minIndex = 0;
    let minHeight = newArray[0];  // 初始最小高度

    for (let i = 0; i < array.length; i++) {
        // 插入当前项
        dataArray[minIndex].push({
            x: (cardWidth * minIndex + gap * (minIndex + 1)) + mrLeft,
            y: newArray[minIndex],
            ...array[i]
        });

        // 更新 newArray[minIndex] 的高度
        // newArray[minIndex] += (cardWidth / array[i].srcs[0].aspect_ratio) + gap;
        newArray[minIndex] += heightFunc(array[i]);
        // 查找下一个最小高度和对应的索引
        minHeight = newArray[minIndex];
        for (let j = 0; j < cols; j++) {
            if (newArray[j] < minHeight) {
                minHeight = newArray[j];
                minIndex = j;
            }
        }
    }
    return dataArray
}


function createCard(item, cardWidth,isTitle=false) {
    const card = document.createElement('div');
    card.setAttribute('class', 'card');
    const img = document.createElement('img');
    if(item.srcs){
        card.setAttribute('style', `position:absolute;left: ${item.x}px;top: ${item.y}px;width: ${cardWidth}px;height: ${cardWidth / item.srcs[0].aspect_ratio}px`);
        img.src = item.srcs[0].src;
        img.setAttribute('style', `width: ${cardWidth}px; height: ${cardWidth / item.srcs[0].aspect_ratio}px;`);
        
    }else{
        card.setAttribute('style', `position:absolute;left: ${item.x}px;top: ${item.y}px;width: ${cardWidth}px;height: ${cardWidth / item.aspect_ratio}px`);
        img.src = item.src;
        img.setAttribute('style', `width: ${cardWidth}px; height: ${cardWidth / item.aspect_ratio}px;`);
        
    }
    
   if (isTitle){ const title = document.createElement('h3');
    title.textContent = item.title;
    title.setAttribute('style', `position:absolute;font-size: ${cardWidth / 18}px;z-index:9;bottom:0;left:10px;color:white`);

    const div = document.createElement('div');
    div.setAttribute('style', `position:absolute;height:40px;left:0;right:0;bottom:-40px;overflow:hidden;background:#fff3;backdrop-filter:blur(10px);transition:all 0.3s ease `)
    div.appendChild(title)  
    card.appendChild(div);
    card.addEventListener('mouseover', () => {
        div.style.bottom = '0px';
    })
    card.addEventListener('mouseout', () => {
        div.style.bottom = '-40px';
    })
}

    
  

    card.appendChild(img);
    return card 
}



function loadData() {
    return new Promise((resolve, reject) => {
        fetch('vipPicture.json')
            .then(response => response.json())
            .then(data => {
                console.log(data); // JSON 内容已解析为对象
                resolve(data);
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error);
            })
    })
}



window.addEventListener('DOMContentLoaded', init);


//防抖
function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}


function scendFolder(img) {
    document.createElement('div')

}