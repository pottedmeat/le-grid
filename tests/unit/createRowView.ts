import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import createRowView from '../../src/createRowView';
import FactoryRegistry from '@dojo/widgets/FactoryRegistry';
import { spy, stub, SinonSpy, SinonStub } from 'sinon';
import * as compose from '@dojo/compose/compose';
import createWidgetBase from '@dojo/widgets/createWidgetBase';

let widgetBaseSpy: SinonSpy;
let getStub: SinonStub;
let isComposeFactoryStub: SinonStub;
let mockRegistry: FactoryRegistry;

registerSuite({
	name: 'createRowView',
	beforeEach() {
		widgetBaseSpy = spy(createWidgetBase);
		getStub = stub().withArgs('dgrid-cell').returns(widgetBaseSpy);
		isComposeFactoryStub = stub(compose, 'isComposeFactory').returns(true);
		mockRegistry = <any> {
			get: getStub,
			has() {
				return true;
			}
		};
	},
	afterEach() {
		isComposeFactoryStub.restore();
	},
	render() {
		const properties = {
			registry: mockRegistry,
			columns: [
				{ id: 'foo', label: 'foo' }
			],
			item: { foo: 'bar' }
		};

		const rowView = createRowView({ properties });
		const vnode = <VNode> rowView.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'tr.dgrid-row');
		assert.strictEqual(vnode.properties!['role'], 'row');
		assert.strictEqual(vnode.properties!.bind, rowView);
		assert.strictEqual(vnode.properties!.key, rowView);
		assert.lengthOf(vnode.children, 1);
		assert.isTrue(widgetBaseSpy.calledOnce);
		assert.isTrue(widgetBaseSpy.calledWith({ properties: { data: 'bar', id: 'foo', renderer: undefined } }));
	},
	'render with no columns'() {
		const properties: any = {
			registry: mockRegistry,
			item: { foo: 'bar' }
		};
		const rowView = createRowView({ properties });

		const vnode = <VNode> rowView.__render__();
		assert.strictEqual(vnode.vnodeSelector, 'tr.dgrid-row');
		assert.lengthOf(vnode.children, 0);
		assert.isTrue(widgetBaseSpy.notCalled);
	}
});
