import {
	animate,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';
import {
	AfterContentInit,
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ContentChild,
	ContentChildren,
	ElementRef,
	EventEmitter,
	Input,
	OnDestroy,
	Output,
	QueryList,
	ViewChild,
} from '@angular/core';
import { fromEvent, merge, Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

type TZippyState = 'expanded' | 'collapsed';

@Component({
	selector: 'app-zippy-content',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZippyContentComponent {}

/**
 * Zippy element that can hide and show its content by clicking header element.
 * It exposes few events that you can listen to.
 *
 * * stateChange - Whenever zippy was collapsed or expanded
 * * collapse - Whenever zippy was collapsed
 * * expand - Whenever zippy was expanded
 */
@Component({
	selector: 'app-zippy',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="zippy">
			<div class="zippy-static" (click)="onStaticClick()">
				<ng-content></ng-content>
			</div>

			<div class="zippy-content" *ngIf="isExpanded" @zippyAnimation>
				<ng-content select="app-zippy-content"></ng-content>
			</div>
		</div>
	`,
	styles: [
		`
			.zippy {
				background: red;
			}

			.zippy-content {
				overflow-y: hidden;
			}
		`,
	],
	animations: [
		trigger('zippyAnimation', [
			state('void', style({ height: 0, opacity: 0 })),

			transition('void => *', animate('500ms cubic-bezier(.62,.28,.23,.99)')),
			transition('* => void', animate('500ms cubic-bezier(.62,.28,.23,.99)')),
		]),
	],
})
export class ZippyComponent {
	constructor(private readonly _changeDetector: ChangeDetectorRef) {}

	@Output('stateChange') onStateChange = new EventEmitter<ZippyComponent>();
	@Output('collapse') onCollapse = new EventEmitter<ZippyComponent>();
	@Output('expand') onExpand = new EventEmitter<ZippyComponent>();
	/** If clicking on static content should toggle the dynamic content */
	@Input('autoToggle') autoToggle = true;

	private _isExpanded = false;

	/** Expands the zippy. */
	expand() {
		this._isExpanded = true;
		this._changeDetector.detectChanges();
		this.onExpand.emit(this);
	}

	/** Collapses the zippy. */
	collapse() {
		this._isExpanded = false;
		this._changeDetector.detectChanges();
		this.onCollapse.emit(this);
	}

	/** Toggles the zippy state. */
	toggle() {
		this._isExpanded ? this.collapse() : this.expand();
		this.onStateChange.emit(this);
	}

	/** When static content was clicked */
	onStaticClick() {
		if (!this.autoToggle) return;

		this.toggle();
	}

	/** Indicates if the zippy is currently expanded. */
	get isExpanded() {
		return this._isExpanded;
	}

	/** Current state of the zippy. */
	@Input('state')
	set state(newState: TZippyState) {
		switch (newState) {
			case 'collapsed':
				this.collapse();
				break;
			case 'expanded':
				this.expand();
				break;

			default:
				throw new Error(`Unknown zippy state (${newState})`);
		}
	}
	get state(): TZippyState {
		return this._isExpanded ? 'expanded' : 'collapsed';
	}
}

/**
 * Zippy list allows only one zippy to be expanded. Automatically collapses others when a new one is expanded.
 * The list selects only zippers to be displayed, other components are ignored.
 */
@Component({
	selector: 'app-zippy-list',
	template: '<ng-content select="app-zippy"></ng-content>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZippyListComponent implements AfterContentInit, OnDestroy {
	@ContentChildren(ZippyComponent) zippers: QueryList<ZippyComponent>;
	private readonly _subscriptions = new Subscription();
	private _onAnyExpandSubscription: Subscription;
	private _lastlyExpanded: ZippyComponent;

	ngAfterContentInit() {
		this._attachListeners();

		this._subscriptions.add(
			this.zippers.changes.subscribe(this._attachListeners.bind(this))
		);
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
		this._onAnyExpandSubscription?.unsubscribe();
	}

	/**
	 * Collapses all zippers besides one.
	 * @param exclude Zippy that will remain expanded
	 */
	collapseList(exclude: ZippyComponent) {
		if (this._lastlyExpanded === exclude) return;
		this._lastlyExpanded?.collapse();
		this._lastlyExpanded = exclude;
	}

	private _attachListeners() {
		this._onAnyExpandSubscription?.unsubscribe();
		this._lastlyExpanded = null;

		const onAnyExpand$: Observable<ZippyComponent>[] = this.zippers.reduce(
			(prev, zippy) => {
				prev.push(zippy.onExpand);

				return prev;
			},
			[]
		);

		this._onAnyExpandSubscription = merge(...onAnyExpand$).subscribe(zippy =>
			this.collapseList(zippy)
		);
	}
}
