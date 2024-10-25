
        function init(){
            fetch('vipPicture.json')
        .then(response => response.json())
        .then(data => {
          console.log(data); // JSON 内容已解析为对象
          const app = document.getElementById('app');

          const containerWidth = app.offsetWidth;
          // const cols = 4;
          // const cardWidth = (containerWidth-gap*(cols+1)) / cols;
          const gap = 6;
          const cardWidth = 200;
          const cols = Math.floor(containerWidth / (cardWidth + gap));
      
          const newArray = new Array(cols).fill(0);
         const dataArray = new Array(cols).fill(null).map(() => []);
      
         let minIndex = 0;
         let minHeight = newArray[0];  // 初始最小高度
         
         for (let i = 0; i < data.length; i++) {
           // 插入当前项
           dataArray[minIndex].push({
             x: cardWidth * minIndex + gap * (minIndex + 1),
             y: newArray[minIndex],
             ...data[i]
           });
         
           // 更新 newArray[minIndex] 的高度
           newArray[minIndex] += (cardWidth / data[i].srcs[0].aspect_ratio) + gap;
         
           // 查找下一个最小高度和对应的索引
           minHeight = newArray[minIndex];
           for (let j = 0; j < cols; j++) {
             if (newArray[j] < minHeight) {
               minHeight = newArray[j];
               minIndex = j;
             }
           }
         }
      
        

          dataArray.forEach(items => {
          items.forEach(item => {
              createCard(item,cardWidth)
          
          })
      
       })
          
      })
      .catch(error => {
        console.error('Error:', error);
        
      })
        }
  
  


function createCard(item,cardWidth){
    const card = document.createElement('div');
     card.setAttribute('class', 'card');
  
     card.setAttribute('style', `position:absolute;left: ${item.x}px;top: ${item.y}px;width: ${cardWidth}px;height: ${cardWidth / item.srcs[0].aspect_ratio}px`);
 
     const h1 = document.createElement('h1');
     h1.textContent = item.title;
     h1.setAttribute('style', `,font-size: ${cardWidth / 12}px;`);

   

     const img = document.createElement('img');
     img.src = item.srcs[0].src;
     img.setAttribute('style', `width: ${cardWidth}px; height: ${cardWidth / item.srcs[0].aspect_ratio}px;`);

     card.appendChild(img);
     card.appendChild(h1);

     app.appendChild(card);
}





init();


window.addEventListener('resize', () => init());