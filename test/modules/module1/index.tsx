import { Module, customModule, Container, VStack } from '@ijstech/components';
import ScomImage from '@scom/scom-image'
@customModule
export default class Module1 extends Module {
    private imageEl: ScomImage;
    private mainStack: VStack;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
        // Test fallback URL
        this.imageEl = await ScomImage.create({
           url: "https://elderscrolls.fandom.com/wiki/Quests_(Dawnguard)",
           // url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png',
           altText: 'placeholder',
           link: 'https://translate.google.com/',
           width: 300,
           height: 200
        });
        // this.imageEl.link = 'https://www.google.com/'
        // this.imageEl.altText = '123'
        // this.imageEl.url ="https://hips.hearstapps.com/hmg-prod/images/summer-flowers-star-flower-1648071187.jpg"
        this.mainStack.appendChild(this.imageEl);
    }

    render() {
        return <i-panel>
            <i-hstack id="mainStack" margin={{top: '1rem', left: '1rem'}} gap="2rem">
               <i-scom-image
                url="https://hips.hearstapps.com/hmg-prod/images/summer-flowers-star-flower-1648071187.jpg"
                altText='placeholder'
                link='https://www.google.com/'
                width={200}
                height={300}
               ></i-scom-image>
            </i-hstack>
        </i-panel>
    }
}