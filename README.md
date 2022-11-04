# NG-WYY

> 使用Angular14搭建的网易云web端。

## 一、模块化设计

------

1. `CoreModule`包含核心模块，`ShareModule`包含共享的UI、基础等模块。

2. `CoreModule`添加以下代码，防止其他Module引入。

   ```typescript
   export class CoreModule {
     constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
       if (parentModule) {
         throw new Error('CoreModule can only be imported by AppModule.')
       }
     }
   }
   ```



## 二、页面布局与服务类

------

### 2.1 页面布局

1. 使用`nz-layout`进行布局。
2. 将`header.wrap`分为左右部分进行处理

### 2.2 服务类

1. 对隶属于`services.module`的服务类，设置`providedIn: ServicesModule`

2. 公共的字符常量可以设置为`InjectionToken`，并在module中声明并导出。

   ```typescript
   export const API_CONFIG = new InjectionToken('ApiConfigToken');
   
   @NgModule({
     declarations: [],
     imports: [],
     providers: [
       {
         provide: API_CONFIG, useValue: 'http://localhost:3000/'
       }
     ]
   })
   export class ServicesModule {
   }
   ```

3. 其他类使用2中字符常量时，可将其进行注入。

   ```typescript
   constructor(@Inject(API_CONFIG) private uri: string) { }
   ```

4. ```typescript
   this.http.get<BannerList>(this.uri + 'banner')
   ```



## 三、走马灯——父子组件通信、模板、变更检测

------

### 3.1 父子组件通信

1. `@Input()`作为子组件的属性，即使用**[ ]**

2. `@Output() new EventEmitter<T>()`作为子组件的方法，即使用**( )**

3. 示例：

   `WyCarousel`

   ```typescript
   @Input() activeIndex = 0;
   @Output() changeSlide = new EventEmitter<'pre' | 'next'>();
   ```

   `homel`

   ```typescript
   <app-wy-carousel #wyCarousel 
   	[activeIndex]="carouselActiveIndex" 
   	(changeSlide)="onChangeSlide($event)"
   >
   ```

### 3.2 模板

1. 修改走马灯Dot渲染模板，需要传入`TemplateRef<{ $implicit: number }>`

   `WyCarousel`

   ```typescript
   <ng-template #dot let-number>
         <span class="dot" [class.active]="activeIndex === number"></span>
   </ng-template>
   
   @ViewChild('dot', {static: true}) dotRef!: TemplateRef<any>;
   ```

   `homel`

   ```html
   <nz-carousel
         nzAutoPlay
         nzEffect="fade"
         [nzDotRender]="wyCarousel.dotRef"
         (nzBeforeChange)="onBeforeChange($event)"
   >
   ```

### 3.3 变更检测

1. 由于`wy-carousel`仅在`@Input`发生变化时需要检测数据更新，故可以修改该组件的变更检测策略

   ```typescript
   @Component({
     selector: 'app-wy-carousel',
     templateUrl: './wy-carousel.component.html',
     styleUrls: ['./wy-carousel.component.less'],
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

2. 官方示例：下面的例子为组件设置了 `OnPush` 变更检测策略（`CheckOnce` 而不是默认的 `CheckAlways`），然后每隔一段时间强制进行第二轮检测。

   ``` typescript
   @Component({
     selector: 'app-root',
     template: `Number of ticks: {{numberOfTicks}}`,
     changeDetection: ChangeDetectionStrategy.OnPush,
   })
   
   class AppComponent {
     numberOfTicks = 0;
   
     constructor(private ref: ChangeDetectorRef) {
       setInterval(() => {
         this.numberOfTicks++;
         // require view to be updated
         this.ref.markForCheck();
       }, 1000);
     }
   }
   ```




## 四、首页——管道、Resolver、获取路由数据

------

### 4.1 管道

1. 创建管道`ng g pipe <pipe-name>`，实现继承方法`PipeTransform.transform`

2. 使用时，直接使用其名称

   ```typescript
   @Pipe({
     name: 'playCount'
   })
   ```

### 4.2 Resolver与获取路由数据

1. 防止数据未加载导致页面显示错误。Resolver可以在导航期间解析数据，提供给其他组件使用。路由器会在最终激活路由之前等待数据被解析。

   ```typescript
   interface Resolve<T> {
     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> | Promise<T> | T
   }
   ```

2. 为防止1中情况出现，可以在Resolver中请求数据，然后通过`resolve`方法返回。

   ```typescript
   const routes: Routes = [
     {
       path: 'home', component: HomeComponent, data: {title: '发现'}, 
       resolve: {homeData: HomeResolver}
     }
   ];
   ```

3. 使用`ActivatedRoute.data`获取路由数据，为方便获取数据，可使用es6的解构语法

   ```typescript
   this.activatedRoute.data.pipe(
         map(({homeData, title}) => homeData)
       ).subscribe((res: HomeDataType) => {
         const [banners, hotTags, songSheetList, singers] = res;
         this.banners = banners;
         this.hotTags = hotTags;
         this.songSheetList = songSheetList;
         this.singers = singers;
       })
   ```

   

