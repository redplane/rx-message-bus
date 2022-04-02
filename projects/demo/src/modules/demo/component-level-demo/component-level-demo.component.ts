import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'component-level-demo',
  templateUrl: './component-level-demo.component.html',
  styleUrls: ['./component-level-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentLevelDemoComponent {
}
