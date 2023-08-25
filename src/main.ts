import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './theme/global.less'
import './theme/animation.less'

const useDrag = (el: any) => {
    try {
        let odiv = el;
        el.onmousedown = (e: any) => {
            let disX = e.clientX - odiv.offsetLeft;
            let disY = e.clientY - odiv.offsetTop;
            let left = 0;
            let top = 0;
            document.onmousemove = (e)=>{
                left = e.clientX - disX;
                top = e.clientY - disY;
                odiv.style.left = left + 'px';
                odiv.style.top = top + 'px';
            };
            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
      } catch (error) {
        
      }
       try {
         let odiv = el;
        el.ontouchstart = (e: any) => {
            let disX = e.touches[0].clientX - odiv.offsetLeft;
            let disY = e.touches[0].clientY - odiv.offsetTop;
            let left = 0;
            let top = 0;
            document.ontouchmove = (e)=>{
                left = e.touches[0].clientX - disX;
                top = e.touches[0].clientY - disY;
                odiv.style.left = left + 'px';
                odiv.style.top = top + 'px';
            };
            document.ontouchend = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
       } catch (error) {
    }
}

createApp(App).use(ElementPlus).directive('drag', useDrag).mount('#app')
