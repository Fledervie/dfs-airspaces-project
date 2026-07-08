const __pluginConfig =  {
  "name": "windy-plugin-dfs-airspaces",
  "version": "0.1.2",
  "icon": "✈",
  "title": "DFS Airspaces",
  "description": "DFS Airspaces",
  "author": "Fledervie",
  "repository": "https://github.com/Fledervie/dfs-airspaces-project",
  "desktopUI": "rhpane",
  "mobileUI": "fullscreen",
  "routerPath": "/dfs-airspaces",
  "private": false,
  "built": 1783522183258,
  "builtReadable": "2026-07-08T14:49:43.258Z",
  "screenshot": "screenshot.jpg"
};

// transformCode: import { map } from '@windy/map';
const { map } = W.map;


/** @returns {void} */
function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @returns {void} */
function destroy_each(iterations, detaching) {
	for (let i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detaching);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @returns {Text} */
function empty() {
	return text('');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @returns {(event: any) => any} */
function prevent_default(fn) {
	return function (event) {
		event.preventDefault();
		// @ts-ignore
		return fn.call(this, event);
	};
}

/**
 * @returns {(event: any) => any} */
function stop_propagation(fn) {
	return function (event) {
		event.stopPropagation();
		// @ts-ignore
		return fn.call(this, event);
	};
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @param {Text} text
 * @param {unknown} data
 * @returns {void}
 */
function set_data(text, data) {
	data = '' + data;
	if (text.data === data) return;
	text.data = /** @type {string} */ (data);
}

/**
 * @returns {void} */
function set_input_value(input, value) {
	input.value = value == null ? '' : value;
}

/**
 * @returns {void} */
function set_style(node, key, value, important) {
	if (value == null) {
		node.style.removeProperty(key);
	} else {
		node.style.setProperty(key, value, '');
	}
}

/**
 * @returns {void} */
function toggle_class(element, name, toggle) {
	// The `!!` is required because an `undefined` flag means flipping the current state.
	element.classList.toggle(name, !!toggle);
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs/svelte#ondestroy
 * @param {() => any} fn
 * @returns {void}
 */
function onDestroy(fn) {
	get_current_component().$$.on_destroy.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

// general each functions:

function ensure_array_like(array_like_or_iterator) {
	return array_like_or_iterator?.length !== undefined
		? array_like_or_iterator
		: Array.from(array_like_or_iterator);
}

// keyed each functions:

/** @returns {void} */
function destroy_block(block, lookup) {
	block.d(1);
	lookup.delete(block.key);
}

/** @returns {any[]} */
function update_keyed_each(
	old_blocks,
	dirty,
	get_key,
	dynamic,
	ctx,
	list,
	lookup,
	node,
	destroy,
	create_each_block,
	next,
	get_context
) {
	let o = old_blocks.length;
	let n = list.length;
	let i = o;
	const old_indexes = {};
	while (i--) old_indexes[old_blocks[i].key] = i;
	const new_blocks = [];
	const new_lookup = new Map();
	const deltas = new Map();
	const updates = [];
	i = n;
	while (i--) {
		const child_ctx = get_context(ctx, list, i);
		const key = get_key(child_ctx);
		let block = lookup.get(key);
		if (!block) {
			block = create_each_block(key, child_ctx);
			block.c();
		} else {
			// defer updates until all the DOM shuffling is done
			updates.push(() => block.p(child_ctx, dirty));
		}
		new_lookup.set(key, (new_blocks[i] = block));
		if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
	}
	const will_move = new Set();
	const did_move = new Set();
	/** @returns {void} */
	function insert(block) {
		transition_in(block, 1);
		block.m(node, next);
		lookup.set(block.key, block);
		next = block.first;
		n--;
	}
	while (o && n) {
		const new_block = new_blocks[n - 1];
		const old_block = old_blocks[o - 1];
		const new_key = new_block.key;
		const old_key = old_block.key;
		if (new_block === old_block) {
			// do nothing
			next = new_block.first;
			o--;
			n--;
		} else if (!new_lookup.has(old_key)) {
			// remove old block
			destroy(old_block, lookup);
			o--;
		} else if (!lookup.has(new_key) || will_move.has(new_key)) {
			insert(new_block);
		} else if (did_move.has(old_key)) {
			o--;
		} else if (deltas.get(new_key) > deltas.get(old_key)) {
			did_move.add(new_key);
			insert(new_block);
		} else {
			will_move.add(old_key);
			o--;
		}
	}
	while (o--) {
		const old_block = old_blocks[o];
		if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
	}
	while (n) insert(new_blocks[n - 1]);
	run_all(updates);
	return new_blocks;
}

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

/* src/plugin.svelte generated by Svelte v4.2.20 */

function add_css(target) {
	append_styles(target, "svelte-1uk04dd", ".plugin__content.svelte-1uk04dd.svelte-1uk04dd{padding:10px;overflow-x:hidden}label.svelte-1uk04dd.svelte-1uk04dd{display:block;margin:7px 0}.update-banner.svelte-1uk04dd.svelte-1uk04dd{background-color:rgba(60, 255, 60, 0.15);border-left:4px solid #3cff3c;border-radius:4px;padding:8px 10px;margin-bottom:12px;font-size:11px;line-height:1.4;color:#ccffcc;animation:svelte-1uk04dd-fadein 0.5s}@keyframes svelte-1uk04dd-fadein{from{opacity:0}to{opacity:1}}.warning-banner.svelte-1uk04dd.svelte-1uk04dd{background-color:rgba(255, 60, 60, 0.15);border-left:4px solid #ff3c3c;border-radius:4px;padding:8px 10px;margin-bottom:12px;font-size:11px;line-height:1.4;color:#ffcccc}.credits-text.svelte-1uk04dd.svelte-1uk04dd{font-size:11px;opacity:0.7;margin-bottom:12px;padding:0 4px;text-align:center}.search-box.svelte-1uk04dd.svelte-1uk04dd{width:100%;padding:7px;margin-bottom:8px;box-sizing:border-box;border-radius:5px;border:1px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.08);color:inherit}.search-results.svelte-1uk04dd.svelte-1uk04dd{max-height:180px;overflow-y:auto;margin-bottom:10px;background:rgba(255,255,255,0.06);border-radius:6px;padding:5px}.info-box.svelte-1uk04dd.svelte-1uk04dd{background:rgba(255,255,255,0.1);border-radius:6px;padding:8px;margin-bottom:10px;min-height:160px;max-height:300px;overflow-y:auto}.detail-box.svelte-1uk04dd.svelte-1uk04dd{background:rgba(255,255,0,0.15);border-radius:6px;padding:8px;margin-bottom:10px;font-size:12px}.airspace-button.svelte-1uk04dd.svelte-1uk04dd{width:100%;text-align:left;margin:4px 0;padding:6px;border-radius:5px;border:1px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.08);color:inherit;cursor:pointer;font-size:12px}.airspace-button.svelte-1uk04dd span.svelte-1uk04dd{font-size:11px;opacity:0.8}.airspace-button.selected.svelte-1uk04dd.svelte-1uk04dd{background:rgba(255,255,0,0.28);border-color:rgba(255,255,0,0.8)}.cat-panel.svelte-1uk04dd.svelte-1uk04dd{margin:8px 0;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:rgba(255,255,255,0.04);overflow:hidden}.cat-header.svelte-1uk04dd.svelte-1uk04dd{list-style:none;cursor:pointer;padding:8px 10px;font-weight:600;background:rgba(255,255,255,0.10);user-select:none}.cat-header.svelte-1uk04dd.svelte-1uk04dd::-webkit-details-marker{display:none}.cat-body.svelte-1uk04dd.svelte-1uk04dd{padding:6px 10px 8px 10px;border-top:1px solid rgba(255,255,255,0.12);position:relative;z-index:0}.fav-btn.svelte-1uk04dd.svelte-1uk04dd{width:100%;margin-top:4px;margin-bottom:6px;padding:5px 6px;border-radius:5px;border:1px solid rgba(255,255,255,0.25);background:rgba(255,215,0,0.15);color:inherit;cursor:pointer;font-size:11px;text-align:left}.fav-btn.active.svelte-1uk04dd.svelte-1uk04dd{background:rgba(255, 215, 0, 0.45);border-color:rgba(255, 215, 0, 0.95);box-shadow:inset 0 0 0 1px rgba(255, 215, 0, 0.35);font-weight:700}.result-row.svelte-1uk04dd.svelte-1uk04dd{display:block}.fav-btn.fav-inline.svelte-1uk04dd.svelte-1uk04dd{display:flex;align-items:center;gap:6px;justify-content:flex-start}.fav-icon.svelte-1uk04dd.svelte-1uk04dd{font-size:14px;line-height:1;width:14px;text-align:center}.fav-btn.fav-inline.active.svelte-1uk04dd.svelte-1uk04dd,.fav-btn.fav-inline[aria-pressed=\"true\"].svelte-1uk04dd.svelte-1uk04dd{background:rgba(255, 215, 0, 0.55) !important;border-color:rgba(255, 215, 0, 1) !important;color:#111 !important;font-weight:700}.fav-btn.fav-inline.active.svelte-1uk04dd .fav-icon.svelte-1uk04dd,.fav-btn.fav-inline[aria-pressed=\"true\"].svelte-1uk04dd .fav-icon.svelte-1uk04dd{color:#8a5a00}.favorites-list.svelte-1uk04dd.svelte-1uk04dd{margin-top:8px;max-height:220px;overflow-y:auto}.favorite-row.svelte-1uk04dd.svelte-1uk04dd{margin-bottom:6px}.color-grid.svelte-1uk04dd.svelte-1uk04dd{display:grid;gap:6px}.color-row.svelte-1uk04dd.svelte-1uk04dd{display:grid;grid-template-columns:minmax(0, 1fr) 42px;align-items:center;gap:8px;margin:0;min-height:30px;font-size:12px}.color-row.svelte-1uk04dd span.svelte-1uk04dd{min-width:0;overflow-wrap:anywhere}.color-row.svelte-1uk04dd input[type=\"color\"].svelte-1uk04dd{width:38px;height:26px;padding:0;border:1px solid rgba(255,255,255,0.25);border-radius:5px;background:transparent;cursor:pointer}.reset-colors-btn.svelte-1uk04dd.svelte-1uk04dd{width:100%;margin-top:10px;padding:6px;border-radius:5px;border:1px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.08);color:inherit;cursor:pointer;font-size:11px;text-align:center}.help-box.svelte-1uk04dd.svelte-1uk04dd{margin-top:12px;padding:9px 10px;border-radius:6px;border:1px solid rgba(255,255,255,0.18);background:rgba(255,255,255,0.06);font-size:11px;line-height:1.4}.help-box.svelte-1uk04dd ul.svelte-1uk04dd{margin:6px 0 0 16px;padding:0}.help-box.svelte-1uk04dd li.svelte-1uk04dd{margin:4px 0}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[113] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[116] = list[i];
	child_ctx[118] = i;
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[116] = list[i];
	const constants_0 = featureId(/*feature*/ child_ctx[116]);
	child_ctx[119] = constants_0;
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[116] = list[i];
	return child_ctx;
}

// (723:4) {#if updateMessage}
function create_if_block_4(ctx) {
	let div;
	let strong;
	let br;
	let t1;
	let t2;

	return {
		c() {
			div = element("div");
			strong = element("strong");
			strong.textContent = "✓ UPDATE";
			br = element("br");
			t1 = space();
			t2 = text(/*updateMessage*/ ctx[0]);
			attr(div, "class", "update-banner svelte-1uk04dd");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, strong);
			append(div, br);
			append(div, t1);
			append(div, t2);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*updateMessage*/ 1) set_data(t2, /*updateMessage*/ ctx[0]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (765:12) {#if favoriteCount > 0}
function create_if_block_3(ctx) {
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let each_value_3 = ensure_array_like(/*currentFavorites*/ ctx[29]);
	const get_key = ctx => featureId(/*feature*/ ctx[116]);

	for (let i = 0; i < each_value_3.length; i += 1) {
		let child_ctx = get_each_context_3(ctx, each_value_3, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_3(key, child_ctx));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "favorites-list svelte-1uk04dd");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*currentFavorites, selectedFeature*/ 536870916 | dirty[1] & /*isFavorite, toggleFavorite, selectFeature*/ 1184) {
				each_value_3 = ensure_array_like(/*currentFavorites*/ ctx[29]);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_3, each_1_lookup, div, destroy_block, create_each_block_3, null, get_each_context_3);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}
		}
	};
}

// (767:20) {#each currentFavorites as feature (featureId(feature))}
function create_each_block_3(key_1, ctx) {
	let div;
	let button0;
	let t0_value = labelFor(/*feature*/ ctx[116]) + "";
	let t0;
	let br;
	let t1;
	let span0;
	let t2_value = (/*feature*/ ctx[116].properties.name || "-") + "";
	let t2;
	let t3;
	let button1;
	let span1;
	let t4_value = (/*isFavorite*/ ctx[36](/*feature*/ ctx[116]) ? "★" : "☆") + "";
	let t4;
	let t5;

	let t6_value = (/*isFavorite*/ ctx[36](/*feature*/ ctx[116])
	? "Favorited (Click to remove)"
	: "Add to Favorites") + "";

	let t6;
	let button1_aria_pressed_value;
	let t7;
	let mounted;
	let dispose;

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[47](/*feature*/ ctx[116], ...args);
	}

	function click_handler_2(...args) {
		return /*click_handler_2*/ ctx[48](/*feature*/ ctx[116], ...args);
	}

	return {
		key: key_1,
		first: null,
		c() {
			div = element("div");
			button0 = element("button");
			t0 = text(t0_value);
			br = element("br");
			t1 = space();
			span0 = element("span");
			t2 = text(t2_value);
			t3 = space();
			button1 = element("button");
			span1 = element("span");
			t4 = text(t4_value);
			t5 = space();
			t6 = text(t6_value);
			t7 = space();
			attr(span0, "class", "svelte-1uk04dd");
			attr(button0, "class", "airspace-button svelte-1uk04dd");
			toggle_class(button0, "selected", /*selectedFeature*/ ctx[2] && featureId(/*selectedFeature*/ ctx[2]) === featureId(/*feature*/ ctx[116]));
			attr(span1, "class", "fav-icon svelte-1uk04dd");
			attr(button1, "class", "fav-btn fav-inline svelte-1uk04dd");
			attr(button1, "aria-pressed", button1_aria_pressed_value = /*isFavorite*/ ctx[36](/*feature*/ ctx[116]));
			toggle_class(button1, "active", /*isFavorite*/ ctx[36](/*feature*/ ctx[116]));
			attr(div, "class", "favorite-row svelte-1uk04dd");
			this.first = div;
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, button0);
			append(button0, t0);
			append(button0, br);
			append(button0, t1);
			append(button0, span0);
			append(span0, t2);
			append(div, t3);
			append(div, button1);
			append(button1, span1);
			append(span1, t4);
			append(button1, t5);
			append(button1, t6);
			append(div, t7);

			if (!mounted) {
				dispose = [
					listen(button0, "click", click_handler_1),
					listen(button1, "click", stop_propagation(prevent_default(click_handler_2)))
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*currentFavorites*/ 536870912 && t0_value !== (t0_value = labelFor(/*feature*/ ctx[116]) + "")) set_data(t0, t0_value);
			if (dirty[0] & /*currentFavorites*/ 536870912 && t2_value !== (t2_value = (/*feature*/ ctx[116].properties.name || "-") + "")) set_data(t2, t2_value);

			if (dirty[0] & /*selectedFeature, currentFavorites*/ 536870916) {
				toggle_class(button0, "selected", /*selectedFeature*/ ctx[2] && featureId(/*selectedFeature*/ ctx[2]) === featureId(/*feature*/ ctx[116]));
			}

			if (dirty[0] & /*currentFavorites*/ 536870912 && t4_value !== (t4_value = (/*isFavorite*/ ctx[36](/*feature*/ ctx[116]) ? "★" : "☆") + "")) set_data(t4, t4_value);

			if (dirty[0] & /*currentFavorites*/ 536870912 && t6_value !== (t6_value = (/*isFavorite*/ ctx[36](/*feature*/ ctx[116])
			? "Favorited (Click to remove)"
			: "Add to Favorites") + "")) set_data(t6, t6_value);

			if (dirty[0] & /*currentFavorites*/ 536870912 && button1_aria_pressed_value !== (button1_aria_pressed_value = /*isFavorite*/ ctx[36](/*feature*/ ctx[116]))) {
				attr(button1, "aria-pressed", button1_aria_pressed_value);
			}

			if (dirty[0] & /*currentFavorites*/ 536870912 | dirty[1] & /*isFavorite*/ 32) {
				toggle_class(button1, "active", /*isFavorite*/ ctx[36](/*feature*/ ctx[116]));
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (793:4) {#if searchResults.length > 0}
function create_if_block_2(ctx) {
	let div;
	let each_value_2 = ensure_array_like(/*searchResults*/ ctx[4]);
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "search-results svelte-1uk04dd");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*searchResults, selectedFeature*/ 20 | dirty[1] & /*isFavoriteById, toggleFavorite, highlightFeature*/ 704) {
				each_value_2 = ensure_array_like(/*searchResults*/ ctx[4]);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (795:12) {#each searchResults as feature}
function create_each_block_2(ctx) {
	let div;
	let button0;
	let t0_value = labelFor(/*feature*/ ctx[116]) + "";
	let t0;
	let br;
	let span0;
	let t1_value = (/*feature*/ ctx[116].properties.name || "-") + "";
	let t1;
	let t2;
	let button1;
	let span1;

	let t3_value = (/*isFavoriteById*/ ctx[37](/*favId*/ ctx[119])
	? "★"
	: "☆") + "";

	let t3;
	let t4;

	let t5_value = (/*isFavoriteById*/ ctx[37](/*favId*/ ctx[119])
	? "Favorited"
	: "Add to Favorites") + "";

	let t5;
	let button1_aria_pressed_value;
	let t6;
	let mounted;
	let dispose;

	function click_handler_3() {
		return /*click_handler_3*/ ctx[49](/*feature*/ ctx[116]);
	}

	function click_handler_4(...args) {
		return /*click_handler_4*/ ctx[50](/*feature*/ ctx[116], ...args);
	}

	return {
		c() {
			div = element("div");
			button0 = element("button");
			t0 = text(t0_value);
			br = element("br");
			span0 = element("span");
			t1 = text(t1_value);
			t2 = space();
			button1 = element("button");
			span1 = element("span");
			t3 = text(t3_value);
			t4 = space();
			t5 = text(t5_value);
			t6 = space();
			attr(span0, "class", "svelte-1uk04dd");
			attr(button0, "class", "airspace-button svelte-1uk04dd");
			toggle_class(button0, "selected", /*selectedFeature*/ ctx[2] === /*feature*/ ctx[116]);
			attr(span1, "class", "fav-icon svelte-1uk04dd");
			attr(button1, "class", "fav-btn fav-inline svelte-1uk04dd");
			attr(button1, "aria-pressed", button1_aria_pressed_value = /*isFavoriteById*/ ctx[37](/*favId*/ ctx[119]));
			toggle_class(button1, "active", /*isFavoriteById*/ ctx[37](/*favId*/ ctx[119]));
			attr(div, "class", "result-row svelte-1uk04dd");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, button0);
			append(button0, t0);
			append(button0, br);
			append(button0, span0);
			append(span0, t1);
			append(div, t2);
			append(div, button1);
			append(button1, span1);
			append(span1, t3);
			append(button1, t4);
			append(button1, t5);
			append(div, t6);

			if (!mounted) {
				dispose = [
					listen(button0, "click", click_handler_3),
					listen(button1, "click", click_handler_4)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*searchResults*/ 16 && t0_value !== (t0_value = labelFor(/*feature*/ ctx[116]) + "")) set_data(t0, t0_value);
			if (dirty[0] & /*searchResults*/ 16 && t1_value !== (t1_value = (/*feature*/ ctx[116].properties.name || "-") + "")) set_data(t1, t1_value);

			if (dirty[0] & /*selectedFeature, searchResults*/ 20) {
				toggle_class(button0, "selected", /*selectedFeature*/ ctx[2] === /*feature*/ ctx[116]);
			}

			if (dirty[0] & /*searchResults*/ 16 && t3_value !== (t3_value = (/*isFavoriteById*/ ctx[37](/*favId*/ ctx[119])
			? "★"
			: "☆") + "")) set_data(t3, t3_value);

			if (dirty[0] & /*searchResults*/ 16 && t5_value !== (t5_value = (/*isFavoriteById*/ ctx[37](/*favId*/ ctx[119])
			? "Favorited"
			: "Add to Favorites") + "")) set_data(t5, t5_value);

			if (dirty[0] & /*searchResults*/ 16 && button1_aria_pressed_value !== (button1_aria_pressed_value = /*isFavoriteById*/ ctx[37](/*favId*/ ctx[119]))) {
				attr(button1, "aria-pressed", button1_aria_pressed_value);
			}

			if (dirty[0] & /*searchResults*/ 16 | dirty[1] & /*isFavoriteById*/ 64) {
				toggle_class(button1, "active", /*isFavoriteById*/ ctx[37](/*favId*/ ctx[119]));
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (818:8) {:else}
function create_else_block(ctx) {
	let p;
	let b;
	let t0;
	let t1_value = /*foundAirspaces*/ ctx[1].length + "";
	let t1;
	let t2;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let each_1_anchor;
	let each_value_1 = ensure_array_like(/*foundAirspaces*/ ctx[1].slice(0, 30));
	const get_key = ctx => featureId(/*feature*/ ctx[116]);

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
	}

	return {
		c() {
			p = element("p");
			b = element("b");
			t0 = text("Found airspaces: ");
			t1 = text(t1_value);
			t2 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			insert(target, p, anchor);
			append(p, b);
			append(b, t0);
			append(b, t1);
			insert(target, t2, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert(target, each_1_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*foundAirspaces*/ 2 && t1_value !== (t1_value = /*foundAirspaces*/ ctx[1].length + "")) set_data(t1, t1_value);

			if (dirty[0] & /*foundAirspaces, selectedFeature*/ 6 | dirty[1] & /*isFavorite, toggleFavorite, highlightFeature*/ 672) {
				each_value_1 = ensure_array_like(/*foundAirspaces*/ ctx[1].slice(0, 30));
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_1, each_1_anchor, get_each_context_1);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(p);
				detach(t2);
				detach(each_1_anchor);
			}

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d(detaching);
			}
		}
	};
}

// (816:8) {#if foundAirspaces.length === 0}
function create_if_block_1(ctx) {
	let p;

	return {
		c() {
			p = element("p");
			p.textContent = "Click the map to show airspaces at that position.";
		},
		m(target, anchor) {
			insert(target, p, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(p);
			}
		}
	};
}

// (821:12) {#each foundAirspaces.slice(0, 30) as feature, index (featureId(feature))}
function create_each_block_1(key_1, ctx) {
	let div;
	let button0;
	let t0_value = /*index*/ ctx[118] + 1 + "";
	let t0;
	let t1;
	let t2_value = labelFor(/*feature*/ ctx[116]) + "";
	let t2;
	let br;
	let span0;
	let t3_value = (/*feature*/ ctx[116].properties.name || "-") + "";
	let t3;
	let t4;
	let button1;
	let span1;
	let t5_value = (/*isFavorite*/ ctx[36](/*feature*/ ctx[116]) ? "★" : "☆") + "";
	let t5;
	let t6;

	let t7_value = (/*isFavorite*/ ctx[36](/*feature*/ ctx[116])
	? "Favorited"
	: "Add to Favorites") + "";

	let t7;
	let button1_aria_pressed_value;
	let t8;
	let mounted;
	let dispose;

	function click_handler_5() {
		return /*click_handler_5*/ ctx[51](/*feature*/ ctx[116]);
	}

	function click_handler_6(...args) {
		return /*click_handler_6*/ ctx[52](/*feature*/ ctx[116], ...args);
	}

	return {
		key: key_1,
		first: null,
		c() {
			div = element("div");
			button0 = element("button");
			t0 = text(t0_value);
			t1 = text(". ");
			t2 = text(t2_value);
			br = element("br");
			span0 = element("span");
			t3 = text(t3_value);
			t4 = space();
			button1 = element("button");
			span1 = element("span");
			t5 = text(t5_value);
			t6 = space();
			t7 = text(t7_value);
			t8 = space();
			attr(span0, "class", "svelte-1uk04dd");
			attr(button0, "class", "airspace-button svelte-1uk04dd");
			toggle_class(button0, "selected", /*selectedFeature*/ ctx[2] === /*feature*/ ctx[116]);
			attr(span1, "class", "fav-icon svelte-1uk04dd");
			attr(button1, "class", "fav-btn fav-inline svelte-1uk04dd");
			attr(button1, "aria-pressed", button1_aria_pressed_value = /*isFavorite*/ ctx[36](/*feature*/ ctx[116]));
			toggle_class(button1, "active", /*isFavorite*/ ctx[36](/*feature*/ ctx[116]));
			attr(div, "class", "result-row svelte-1uk04dd");
			this.first = div;
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, button0);
			append(button0, t0);
			append(button0, t1);
			append(button0, t2);
			append(button0, br);
			append(button0, span0);
			append(span0, t3);
			append(div, t4);
			append(div, button1);
			append(button1, span1);
			append(span1, t5);
			append(button1, t6);
			append(button1, t7);
			append(div, t8);

			if (!mounted) {
				dispose = [
					listen(button0, "click", click_handler_5),
					listen(button1, "click", stop_propagation(prevent_default(click_handler_6)))
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*foundAirspaces*/ 2 && t0_value !== (t0_value = /*index*/ ctx[118] + 1 + "")) set_data(t0, t0_value);
			if (dirty[0] & /*foundAirspaces*/ 2 && t2_value !== (t2_value = labelFor(/*feature*/ ctx[116]) + "")) set_data(t2, t2_value);
			if (dirty[0] & /*foundAirspaces*/ 2 && t3_value !== (t3_value = (/*feature*/ ctx[116].properties.name || "-") + "")) set_data(t3, t3_value);

			if (dirty[0] & /*selectedFeature, foundAirspaces*/ 6) {
				toggle_class(button0, "selected", /*selectedFeature*/ ctx[2] === /*feature*/ ctx[116]);
			}

			if (dirty[0] & /*foundAirspaces*/ 2 && t5_value !== (t5_value = (/*isFavorite*/ ctx[36](/*feature*/ ctx[116]) ? "★" : "☆") + "")) set_data(t5, t5_value);

			if (dirty[0] & /*foundAirspaces*/ 2 && t7_value !== (t7_value = (/*isFavorite*/ ctx[36](/*feature*/ ctx[116])
			? "Favorited"
			: "Add to Favorites") + "")) set_data(t7, t7_value);

			if (dirty[0] & /*foundAirspaces*/ 2 && button1_aria_pressed_value !== (button1_aria_pressed_value = /*isFavorite*/ ctx[36](/*feature*/ ctx[116]))) {
				attr(button1, "aria-pressed", button1_aria_pressed_value);
			}

			if (dirty[0] & /*foundAirspaces*/ 2 | dirty[1] & /*isFavorite*/ 32) {
				toggle_class(button1, "active", /*isFavorite*/ ctx[36](/*feature*/ ctx[116]));
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (840:4) {#if selectedFeature}
function create_if_block(ctx) {
	let div;
	let b;
	let t0_value = labelFor(/*selectedFeature*/ ctx[2]) + "";
	let t0;
	let br0;
	let t1;
	let t2_value = (/*selectedFeature*/ ctx[2].properties.name || "-") + "";
	let t2;
	let br1;
	let br2;
	let t3;
	let t4_value = (/*selectedFeature*/ ctx[2].properties.local_type || /*selectedFeature*/ ctx[2].properties.airspace_type || "-") + "";
	let t4;
	let br3;
	let t5;
	let t6_value = (/*selectedFeature*/ ctx[2].properties.category || "-") + "";
	let t6;
	let br4;
	let t7;
	let t8_value = (/*selectedFeature*/ ctx[2].properties.lower_limit || "-") + "";
	let t8;
	let br5;
	let t9;
	let t10_value = (/*selectedFeature*/ ctx[2].properties.upper_limit || "-") + "";
	let t10;
	let br6;
	let t11;
	let button;

	let t12_value = (/*isFavorite*/ ctx[36](/*selectedFeature*/ ctx[2])
	? "★ Remove Favorite"
	: "☆ Add Favorite") + "";

	let t12;
	let button_aria_pressed_value;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			b = element("b");
			t0 = text(t0_value);
			br0 = element("br");
			t1 = space();
			t2 = text(t2_value);
			br1 = element("br");
			br2 = element("br");
			t3 = text("\n\n            Type: ");
			t4 = text(t4_value);
			br3 = element("br");
			t5 = text("\n            Category: ");
			t6 = text(t6_value);
			br4 = element("br");
			t7 = text("\n            Lower limit: ");
			t8 = text(t8_value);
			br5 = element("br");
			t9 = text("\n            Upper limit: ");
			t10 = text(t10_value);
			br6 = element("br");
			t11 = space();
			button = element("button");
			t12 = text(t12_value);
			attr(button, "class", "fav-btn svelte-1uk04dd");
			attr(button, "aria-pressed", button_aria_pressed_value = /*isFavorite*/ ctx[36](/*selectedFeature*/ ctx[2]));
			toggle_class(button, "active", /*isFavorite*/ ctx[36](/*selectedFeature*/ ctx[2]));
			attr(div, "class", "detail-box svelte-1uk04dd");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, b);
			append(b, t0);
			append(div, br0);
			append(div, t1);
			append(div, t2);
			append(div, br1);
			append(div, br2);
			append(div, t3);
			append(div, t4);
			append(div, br3);
			append(div, t5);
			append(div, t6);
			append(div, br4);
			append(div, t7);
			append(div, t8);
			append(div, br5);
			append(div, t9);
			append(div, t10);
			append(div, br6);
			append(div, t11);
			append(div, button);
			append(button, t12);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler_7*/ ctx[53]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*selectedFeature*/ 4 && t0_value !== (t0_value = labelFor(/*selectedFeature*/ ctx[2]) + "")) set_data(t0, t0_value);
			if (dirty[0] & /*selectedFeature*/ 4 && t2_value !== (t2_value = (/*selectedFeature*/ ctx[2].properties.name || "-") + "")) set_data(t2, t2_value);
			if (dirty[0] & /*selectedFeature*/ 4 && t4_value !== (t4_value = (/*selectedFeature*/ ctx[2].properties.local_type || /*selectedFeature*/ ctx[2].properties.airspace_type || "-") + "")) set_data(t4, t4_value);
			if (dirty[0] & /*selectedFeature*/ 4 && t6_value !== (t6_value = (/*selectedFeature*/ ctx[2].properties.category || "-") + "")) set_data(t6, t6_value);
			if (dirty[0] & /*selectedFeature*/ 4 && t8_value !== (t8_value = (/*selectedFeature*/ ctx[2].properties.lower_limit || "-") + "")) set_data(t8, t8_value);
			if (dirty[0] & /*selectedFeature*/ 4 && t10_value !== (t10_value = (/*selectedFeature*/ ctx[2].properties.upper_limit || "-") + "")) set_data(t10, t10_value);

			if (dirty[0] & /*selectedFeature*/ 4 && t12_value !== (t12_value = (/*isFavorite*/ ctx[36](/*selectedFeature*/ ctx[2])
			? "★ Remove Favorite"
			: "☆ Add Favorite") + "")) set_data(t12, t12_value);

			if (dirty[0] & /*selectedFeature*/ 4 && button_aria_pressed_value !== (button_aria_pressed_value = /*isFavorite*/ ctx[36](/*selectedFeature*/ ctx[2]))) {
				attr(button, "aria-pressed", button_aria_pressed_value);
			}

			if (dirty[0] & /*selectedFeature*/ 4 | dirty[1] & /*isFavorite*/ 32) {
				toggle_class(button, "active", /*isFavorite*/ ctx[36](/*selectedFeature*/ ctx[2]));
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			mounted = false;
			dispose();
		}
	};
}

// (921:16) {#each groups as group}
function create_each_block(ctx) {
	let label;
	let span;
	let t1;
	let input;
	let input_value_value;
	let t2;
	let mounted;
	let dispose;

	function input_handler_1(...args) {
		return /*input_handler_1*/ ctx[75](/*group*/ ctx[113], ...args);
	}

	return {
		c() {
			label = element("label");
			span = element("span");
			span.textContent = `${/*groupLabel*/ ctx[33](/*group*/ ctx[113])}`;
			t1 = space();
			input = element("input");
			t2 = space();
			attr(span, "class", "svelte-1uk04dd");
			attr(input, "type", "color");
			input.value = input_value_value = /*groupColors*/ ctx[27][/*group*/ ctx[113]];
			attr(input, "title", `Color for ${/*groupLabel*/ ctx[33](/*group*/ ctx[113])}`);
			attr(input, "class", "svelte-1uk04dd");
			attr(label, "class", "color-row svelte-1uk04dd");
		},
		m(target, anchor) {
			insert(target, label, anchor);
			append(label, span);
			append(label, t1);
			append(label, input);
			append(label, t2);

			if (!mounted) {
				dispose = [
					listen(input, "input", input_handler_1),
					listen(input, "click", click_handler_8)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*groupColors*/ 134217728 && input_value_value !== (input_value_value = /*groupColors*/ ctx[27][/*group*/ ctx[113]])) {
				input.value = input_value_value;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(label);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

function create_fragment(ctx) {
	let div14;
	let h2;
	let t1;
	let t2;
	let div0;
	let t6;
	let div1;
	let t8;
	let input0;
	let t9;
	let details0;
	let summary0;
	let t11;
	let div3;
	let label0;
	let input1;
	let t12;
	let t13;
	let div2;
	let t14;
	let t15;
	let t16;
	let t17;
	let t18;
	let div4;
	let t19;
	let t20;
	let details1;
	let summary1;
	let t22;
	let div5;
	let label1;
	let input2;
	let t23;
	let t24;
	let label2;
	let input3;
	let t25;
	let t26;
	let label3;
	let input4;
	let t27;
	let t28;
	let label4;
	let input5;
	let t29;
	let t30;
	let label5;
	let input6;
	let t31;
	let t32;
	let details2;
	let summary2;
	let t34;
	let div6;
	let label6;
	let input7;
	let t35;
	let t36;
	let label7;
	let input8;
	let t37;
	let t38;
	let details3;
	let summary3;
	let t40;
	let div7;
	let label8;
	let input9;
	let t41;
	let t42;
	let label9;
	let input10;
	let t43;
	let t44;
	let label10;
	let input11;
	let t45;
	let t46;
	let label11;
	let input12;
	let t47;
	let t48;
	let details4;
	let summary4;
	let t50;
	let div8;
	let label12;
	let input13;
	let t51;
	let t52;
	let label13;
	let input14;
	let t53;
	let t54;
	let label14;
	let input15;
	let t55;
	let t56;
	let label15;
	let input16;
	let t57;
	let t58;
	let label16;
	let input17;
	let t59;
	let t60;
	let details5;
	let summary5;
	let t62;
	let div9;
	let label17;
	let input18;
	let t63;
	let t64;
	let details6;
	let summary6;
	let t66;
	let div10;
	let label18;
	let input19;
	let t67;
	let t68;
	let label19;
	let input20;
	let t69;
	let t70;
	let label20;
	let input21;
	let t71;
	let t72;
	let label21;
	let input22;
	let t73;
	let t74;
	let details7;
	let summary7;
	let t76;
	let div12;
	let div11;
	let t77;
	let button;
	let t79;
	let div13;
	let mounted;
	let dispose;
	let if_block0 = /*updateMessage*/ ctx[0] && create_if_block_4(ctx);
	let if_block1 = /*favoriteCount*/ ctx[28] > 0 && create_if_block_3(ctx);
	let if_block2 = /*searchResults*/ ctx[4].length > 0 && create_if_block_2(ctx);

	function select_block_type(ctx, dirty) {
		if (/*foundAirspaces*/ ctx[1].length === 0) return create_if_block_1;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block3 = current_block_type(ctx);
	let if_block4 = /*selectedFeature*/ ctx[2] && create_if_block(ctx);
	let each_value = ensure_array_like(/*groups*/ ctx[32]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div14 = element("div");
			h2 = element("h2");
			h2.textContent = "DFS Airspaces";
			t1 = space();
			if (if_block0) if_block0.c();
			t2 = space();
			div0 = element("div");

			div0.innerHTML = `<strong>⚠️ WARNING - NOT FOR REAL NAVIGATION!</strong><br/>
        With kind permission of DFS Deutsche Flugsicherung GmbH.<br/>
        Do not use for navigational purposes. No guarantee for accuracy, completeness, or timeliness.`;

			t6 = space();
			div1 = element("div");
			div1.innerHTML = `<em>Plugin UI by Fledervie | GeoJSON Parser by Lucas Wankerl</em>`;
			t8 = space();
			input0 = element("input");
			t9 = space();
			details0 = element("details");
			summary0 = element("summary");
			summary0.textContent = "Favorites";
			t11 = space();
			div3 = element("div");
			label0 = element("label");
			input1 = element("input");
			t12 = text("\n                Show Favorites Only");
			t13 = space();
			div2 = element("div");
			t14 = text("Saved: ");
			t15 = text(/*favoriteCount*/ ctx[28]);
			t16 = space();
			if (if_block1) if_block1.c();
			t17 = space();
			if (if_block2) if_block2.c();
			t18 = space();
			div4 = element("div");
			if_block3.c();
			t19 = space();
			if (if_block4) if_block4.c();
			t20 = space();
			details1 = element("details");
			summary1 = element("summary");
			summary1.textContent = "Core Airspace Restrictions";
			t22 = space();
			div5 = element("div");
			label1 = element("label");
			input2 = element("input");
			t23 = text(" Restricted / TRA / ED-R");
			t24 = space();
			label2 = element("label");
			input3 = element("input");
			t25 = text(" Danger Areas");
			t26 = space();
			label3 = element("label");
			input4 = element("input");
			t27 = text(" Protective Areas");
			t28 = space();
			label4 = element("label");
			input5 = element("input");
			t29 = text(" Prohibited Areas");
			t30 = space();
			label5 = element("label");
			input6 = element("input");
			t31 = text(" Temporary / NOTAM-based Airspace");
			t32 = space();
			details2 = element("details");
			summary2 = element("summary");
			summary2.textContent = "Controlled Airspace";
			t34 = space();
			div6 = element("div");
			label6 = element("label");
			input7 = element("input");
			t35 = text(" CTR (Control Zone)");
			t36 = space();
			label7 = element("label");
			input8 = element("input");
			t37 = text(" CTA / UTA");
			t38 = space();
			details3 = element("details");
			summary3 = element("summary");
			summary3.textContent = "Special Use Airspace";
			t40 = space();
			div7 = element("div");
			label8 = element("label");
			input9 = element("input");
			t41 = text(" RMZ");
			t42 = space();
			label9 = element("label");
			input10 = element("input");
			t43 = text(" TMZ");
			t44 = space();
			label10 = element("label");
			input11 = element("input");
			t45 = text(" ATZ");
			t46 = space();
			label11 = element("label");
			input12 = element("input");
			t47 = text(" Navigation / Radio-related Airspace");
			t48 = space();
			details4 = element("details");
			summary4 = element("summary");
			summary4.textContent = "Operational Structure & Use";
			t50 = space();
			div8 = element("div");
			label12 = element("label");
			input13 = element("input");
			t51 = text(" Flight Information Sectors (FIS)");
			t52 = space();
			label13 = element("label");
			input14 = element("input");
			t53 = text(" Airspace Sectors");
			t54 = space();
			label14 = element("label");
			input15 = element("input");
			t55 = text(" Glider Operating Areas");
			t56 = space();
			label15 = element("label");
			input16 = element("input");
			t57 = text(" UAS / UAV Operating Areas");
			t58 = space();
			label16 = element("label");
			input17 = element("input");
			t59 = text(" Military Activity Areas");
			t60 = space();
			details5 = element("details");
			summary5 = element("summary");
			summary5.textContent = "Residual Classification";
			t62 = space();
			div9 = element("div");
			label17 = element("label");
			input18 = element("input");
			t63 = text(" Other / Unclassified");
			t64 = space();
			details6 = element("details");
			summary6 = element("summary");
			summary6.textContent = "Aggregate Toggles";
			t66 = space();
			div10 = element("div");
			label18 = element("label");
			input19 = element("input");
			t67 = text(" Military Aggregate (Restricted/Danger/Protect/Military)");
			t68 = space();
			label19 = element("label");
			input20 = element("input");
			t69 = text(" Special Zone Aggregate (RMZ/TMZ/ATZ)");
			t70 = space();
			label20 = element("label");
			input21 = element("input");
			t71 = text(" Information Aggregate (FIS/Sector)");
			t72 = space();
			label21 = element("label");
			input22 = element("input");
			t73 = text(" Recreational/Unmanned Aggregate (Glider/UAV)");
			t74 = space();
			details7 = element("details");
			summary7 = element("summary");
			summary7.textContent = "Customize Colors";
			t76 = space();
			div12 = element("div");
			div11 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t77 = space();
			button = element("button");
			button.textContent = "Restore default colors";
			t79 = space();
			div13 = element("div");
			div13.innerHTML = `<b>How to use</b> <ul class="svelte-1uk04dd"><li class="svelte-1uk04dd">Left-click the map to list all active airspaces at that position.</li> <li class="svelte-1uk04dd">Right-click the map to select the top result directly, highlight it in yellow, and open an info popup.</li> <li class="svelte-1uk04dd">Use the star button to add or remove favorites. New favorites automatically make their category visible.</li> <li class="svelte-1uk04dd">In Favorites, enable &quot;Show Favorites Only&quot; to display only saved areas.</li> <li class="svelte-1uk04dd">Search also finds hidden areas, so you can still select them or save them as favorites.</li></ul>`;
			attr(div0, "class", "warning-banner svelte-1uk04dd");
			attr(div1, "class", "credits-text svelte-1uk04dd");
			attr(input0, "class", "search-box svelte-1uk04dd");
			attr(input0, "type", "text");
			attr(input0, "placeholder", "Search: EDR201, TRA Friesland, RMZ...");
			attr(summary0, "class", "cat-header svelte-1uk04dd");
			attr(input1, "type", "checkbox");
			attr(label0, "class", "svelte-1uk04dd");
			set_style(div2, "font-size", "11px");
			set_style(div2, "opacity", "0.8");
			attr(div3, "class", "cat-body svelte-1uk04dd");
			attr(details0, "class", "cat-panel svelte-1uk04dd");
			attr(div4, "class", "info-box svelte-1uk04dd");
			attr(summary1, "class", "cat-header svelte-1uk04dd");
			attr(input2, "type", "checkbox");
			attr(label1, "class", "svelte-1uk04dd");
			attr(input3, "type", "checkbox");
			attr(label2, "class", "svelte-1uk04dd");
			attr(input4, "type", "checkbox");
			attr(label3, "class", "svelte-1uk04dd");
			attr(input5, "type", "checkbox");
			attr(label4, "class", "svelte-1uk04dd");
			attr(input6, "type", "checkbox");
			attr(label5, "class", "svelte-1uk04dd");
			attr(div5, "class", "cat-body svelte-1uk04dd");
			attr(details1, "class", "cat-panel svelte-1uk04dd");
			details1.open = true;
			attr(summary2, "class", "cat-header svelte-1uk04dd");
			attr(input7, "type", "checkbox");
			attr(label6, "class", "svelte-1uk04dd");
			attr(input8, "type", "checkbox");
			attr(label7, "class", "svelte-1uk04dd");
			attr(div6, "class", "cat-body svelte-1uk04dd");
			attr(details2, "class", "cat-panel svelte-1uk04dd");
			attr(summary3, "class", "cat-header svelte-1uk04dd");
			attr(input9, "type", "checkbox");
			attr(label8, "class", "svelte-1uk04dd");
			attr(input10, "type", "checkbox");
			attr(label9, "class", "svelte-1uk04dd");
			attr(input11, "type", "checkbox");
			attr(label10, "class", "svelte-1uk04dd");
			attr(input12, "type", "checkbox");
			attr(label11, "class", "svelte-1uk04dd");
			attr(div7, "class", "cat-body svelte-1uk04dd");
			attr(details3, "class", "cat-panel svelte-1uk04dd");
			attr(summary4, "class", "cat-header svelte-1uk04dd");
			attr(input13, "type", "checkbox");
			attr(label12, "class", "svelte-1uk04dd");
			attr(input14, "type", "checkbox");
			attr(label13, "class", "svelte-1uk04dd");
			attr(input15, "type", "checkbox");
			attr(label14, "class", "svelte-1uk04dd");
			attr(input16, "type", "checkbox");
			attr(label15, "class", "svelte-1uk04dd");
			attr(input17, "type", "checkbox");
			attr(label16, "class", "svelte-1uk04dd");
			attr(div8, "class", "cat-body svelte-1uk04dd");
			attr(details4, "class", "cat-panel svelte-1uk04dd");
			attr(summary5, "class", "cat-header svelte-1uk04dd");
			attr(input18, "type", "checkbox");
			attr(label17, "class", "svelte-1uk04dd");
			attr(div9, "class", "cat-body svelte-1uk04dd");
			attr(details5, "class", "cat-panel svelte-1uk04dd");
			attr(summary6, "class", "cat-header svelte-1uk04dd");
			attr(input19, "type", "checkbox");
			attr(label18, "class", "svelte-1uk04dd");
			attr(input20, "type", "checkbox");
			attr(label19, "class", "svelte-1uk04dd");
			attr(input21, "type", "checkbox");
			attr(label20, "class", "svelte-1uk04dd");
			attr(input22, "type", "checkbox");
			attr(label21, "class", "svelte-1uk04dd");
			attr(div10, "class", "cat-body svelte-1uk04dd");
			attr(details6, "class", "cat-panel svelte-1uk04dd");
			attr(summary7, "class", "cat-header svelte-1uk04dd");
			attr(div11, "class", "color-grid svelte-1uk04dd");
			attr(button, "class", "reset-colors-btn svelte-1uk04dd");
			attr(div12, "class", "cat-body svelte-1uk04dd");
			attr(details7, "class", "cat-panel svelte-1uk04dd");
			attr(div13, "class", "help-box svelte-1uk04dd");
			attr(div14, "class", "plugin__content svelte-1uk04dd");
		},
		m(target, anchor) {
			insert(target, div14, anchor);
			append(div14, h2);
			append(div14, t1);
			if (if_block0) if_block0.m(div14, null);
			append(div14, t2);
			append(div14, div0);
			append(div14, t6);
			append(div14, div1);
			append(div14, t8);
			append(div14, input0);
			set_input_value(input0, /*searchText*/ ctx[3]);
			append(div14, t9);
			append(div14, details0);
			append(details0, summary0);
			append(details0, t11);
			append(details0, div3);
			append(div3, label0);
			append(label0, input1);
			input1.checked = /*showFavoritesOnly*/ ctx[26];
			append(label0, t12);
			append(div3, t13);
			append(div3, div2);
			append(div2, t14);
			append(div2, t15);
			append(div3, t16);
			if (if_block1) if_block1.m(div3, null);
			append(div14, t17);
			if (if_block2) if_block2.m(div14, null);
			append(div14, t18);
			append(div14, div4);
			if_block3.m(div4, null);
			append(div14, t19);
			if (if_block4) if_block4.m(div14, null);
			append(div14, t20);
			append(div14, details1);
			append(details1, summary1);
			append(details1, t22);
			append(details1, div5);
			append(div5, label1);
			append(label1, input2);
			input2.checked = /*showRestricted*/ ctx[5];
			append(label1, t23);
			append(div5, t24);
			append(div5, label2);
			append(label2, input3);
			input3.checked = /*showDanger*/ ctx[6];
			append(label2, t25);
			append(div5, t26);
			append(div5, label3);
			append(label3, input4);
			input4.checked = /*showProtect*/ ctx[7];
			append(label3, t27);
			append(div5, t28);
			append(div5, label4);
			append(label4, input5);
			input5.checked = /*showProhibited*/ ctx[18];
			append(label4, t29);
			append(div5, t30);
			append(div5, label5);
			append(label5, input6);
			input6.checked = /*showTemporary*/ ctx[19];
			append(label5, t31);
			append(div14, t32);
			append(div14, details2);
			append(details2, summary2);
			append(details2, t34);
			append(details2, div6);
			append(div6, label6);
			append(label6, input7);
			input7.checked = /*showCtr*/ ctx[8];
			append(label6, t35);
			append(div6, t36);
			append(div6, label7);
			append(label7, input8);
			input8.checked = /*showCtaUta*/ ctx[9];
			append(label7, t37);
			append(div14, t38);
			append(div14, details3);
			append(details3, summary3);
			append(details3, t40);
			append(details3, div7);
			append(div7, label8);
			append(label8, input9);
			input9.checked = /*showRmz*/ ctx[10];
			append(label8, t41);
			append(div7, t42);
			append(div7, label9);
			append(label9, input10);
			input10.checked = /*showTmz*/ ctx[11];
			append(label9, t43);
			append(div7, t44);
			append(div7, label10);
			append(label10, input11);
			input11.checked = /*showAtz*/ ctx[12];
			append(label10, t45);
			append(div7, t46);
			append(div7, label11);
			append(label11, input12);
			input12.checked = /*showNavRadio*/ ctx[20];
			append(label11, t47);
			append(div14, t48);
			append(div14, details4);
			append(details4, summary4);
			append(details4, t50);
			append(details4, div8);
			append(div8, label12);
			append(label12, input13);
			input13.checked = /*showFis*/ ctx[13];
			append(label12, t51);
			append(div8, t52);
			append(div8, label13);
			append(label13, input14);
			input14.checked = /*showSectors*/ ctx[14];
			append(label13, t53);
			append(div8, t54);
			append(div8, label14);
			append(label14, input15);
			input15.checked = /*showGlider*/ ctx[15];
			append(label14, t55);
			append(div8, t56);
			append(div8, label15);
			append(label15, input16);
			input16.checked = /*showUav*/ ctx[16];
			append(label15, t57);
			append(div8, t58);
			append(div8, label16);
			append(label16, input17);
			input17.checked = /*showMilitary*/ ctx[21];
			append(label16, t59);
			append(div14, t60);
			append(div14, details5);
			append(details5, summary5);
			append(details5, t62);
			append(details5, div9);
			append(div9, label17);
			append(label17, input18);
			input18.checked = /*showOther*/ ctx[17];
			append(label17, t63);
			append(div14, t64);
			append(div14, details6);
			append(details6, summary6);
			append(details6, t66);
			append(details6, div10);
			append(div10, label18);
			append(label18, input19);
			input19.checked = /*showMilitaryAll*/ ctx[25];
			append(label18, t67);
			append(div10, t68);
			append(div10, label19);
			append(label19, input20);
			input20.checked = /*showSpecialZones*/ ctx[22];
			append(label19, t69);
			append(div10, t70);
			append(div10, label20);
			append(label20, input21);
			input21.checked = /*showInfoAreas*/ ctx[23];
			append(label20, t71);
			append(div10, t72);
			append(div10, label21);
			append(label21, input22);
			input22.checked = /*showSportUas*/ ctx[24];
			append(label21, t73);
			append(div14, t74);
			append(div14, details7);
			append(details7, summary7);
			append(details7, t76);
			append(details7, div12);
			append(div12, div11);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div11, null);
				}
			}

			append(div12, t77);
			append(div12, button);
			append(div14, t79);
			append(div14, div13);

			if (!mounted) {
				dispose = [
					listen(input0, "input", /*input0_input_handler*/ ctx[44]),
					listen(input0, "input", /*input_handler*/ ctx[45]),
					listen(input0, "click", click_handler),
					listen(input0, "mousedown", mousedown_handler),
					listen(input0, "keydown", keydown_handler),
					listen(input0, "keypress", keypress_handler),
					listen(input0, "keyup", keyup_handler),
					listen(input1, "change", /*input1_change_handler*/ ctx[46]),
					listen(input1, "change", /*handleFavoritesChange*/ ctx[31]),
					listen(input2, "change", /*input2_change_handler*/ ctx[54]),
					listen(input2, "change", /*handleToggleChange*/ ctx[30]),
					listen(input3, "change", /*input3_change_handler*/ ctx[55]),
					listen(input3, "change", /*handleToggleChange*/ ctx[30]),
					listen(input4, "change", /*input4_change_handler*/ ctx[56]),
					listen(input4, "change", /*handleToggleChange*/ ctx[30]),
					listen(input5, "change", /*input5_change_handler*/ ctx[57]),
					listen(input5, "change", /*handleToggleChange*/ ctx[30]),
					listen(input6, "change", /*input6_change_handler*/ ctx[58]),
					listen(input6, "change", /*handleToggleChange*/ ctx[30]),
					listen(input7, "change", /*input7_change_handler*/ ctx[59]),
					listen(input7, "change", /*handleToggleChange*/ ctx[30]),
					listen(input8, "change", /*input8_change_handler*/ ctx[60]),
					listen(input8, "change", /*handleToggleChange*/ ctx[30]),
					listen(input9, "change", /*input9_change_handler*/ ctx[61]),
					listen(input9, "change", /*handleToggleChange*/ ctx[30]),
					listen(input10, "change", /*input10_change_handler*/ ctx[62]),
					listen(input10, "change", /*handleToggleChange*/ ctx[30]),
					listen(input11, "change", /*input11_change_handler*/ ctx[63]),
					listen(input11, "change", /*handleToggleChange*/ ctx[30]),
					listen(input12, "change", /*input12_change_handler*/ ctx[64]),
					listen(input12, "change", /*handleToggleChange*/ ctx[30]),
					listen(input13, "change", /*input13_change_handler*/ ctx[65]),
					listen(input13, "change", /*handleToggleChange*/ ctx[30]),
					listen(input14, "change", /*input14_change_handler*/ ctx[66]),
					listen(input14, "change", /*handleToggleChange*/ ctx[30]),
					listen(input15, "change", /*input15_change_handler*/ ctx[67]),
					listen(input15, "change", /*handleToggleChange*/ ctx[30]),
					listen(input16, "change", /*input16_change_handler*/ ctx[68]),
					listen(input16, "change", /*handleToggleChange*/ ctx[30]),
					listen(input17, "change", /*input17_change_handler*/ ctx[69]),
					listen(input17, "change", /*handleToggleChange*/ ctx[30]),
					listen(input18, "change", /*input18_change_handler*/ ctx[70]),
					listen(input18, "change", /*handleToggleChange*/ ctx[30]),
					listen(input19, "change", /*input19_change_handler*/ ctx[71]),
					listen(input19, "change", /*handleToggleChange*/ ctx[30]),
					listen(input20, "change", /*input20_change_handler*/ ctx[72]),
					listen(input20, "change", /*handleToggleChange*/ ctx[30]),
					listen(input21, "change", /*input21_change_handler*/ ctx[73]),
					listen(input21, "change", /*handleToggleChange*/ ctx[30]),
					listen(input22, "change", /*input22_change_handler*/ ctx[74]),
					listen(input22, "change", /*handleToggleChange*/ ctx[30]),
					listen(button, "click", /*resetGroupColors*/ ctx[35])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (/*updateMessage*/ ctx[0]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_4(ctx);
					if_block0.c();
					if_block0.m(div14, t2);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty[0] & /*searchText*/ 8 && input0.value !== /*searchText*/ ctx[3]) {
				set_input_value(input0, /*searchText*/ ctx[3]);
			}

			if (dirty[0] & /*showFavoritesOnly*/ 67108864) {
				input1.checked = /*showFavoritesOnly*/ ctx[26];
			}

			if (dirty[0] & /*favoriteCount*/ 268435456) set_data(t15, /*favoriteCount*/ ctx[28]);

			if (/*favoriteCount*/ ctx[28] > 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_3(ctx);
					if_block1.c();
					if_block1.m(div3, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*searchResults*/ ctx[4].length > 0) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_2(ctx);
					if_block2.c();
					if_block2.m(div14, t18);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block3) {
				if_block3.p(ctx, dirty);
			} else {
				if_block3.d(1);
				if_block3 = current_block_type(ctx);

				if (if_block3) {
					if_block3.c();
					if_block3.m(div4, null);
				}
			}

			if (/*selectedFeature*/ ctx[2]) {
				if (if_block4) {
					if_block4.p(ctx, dirty);
				} else {
					if_block4 = create_if_block(ctx);
					if_block4.c();
					if_block4.m(div14, t20);
				}
			} else if (if_block4) {
				if_block4.d(1);
				if_block4 = null;
			}

			if (dirty[0] & /*showRestricted*/ 32) {
				input2.checked = /*showRestricted*/ ctx[5];
			}

			if (dirty[0] & /*showDanger*/ 64) {
				input3.checked = /*showDanger*/ ctx[6];
			}

			if (dirty[0] & /*showProtect*/ 128) {
				input4.checked = /*showProtect*/ ctx[7];
			}

			if (dirty[0] & /*showProhibited*/ 262144) {
				input5.checked = /*showProhibited*/ ctx[18];
			}

			if (dirty[0] & /*showTemporary*/ 524288) {
				input6.checked = /*showTemporary*/ ctx[19];
			}

			if (dirty[0] & /*showCtr*/ 256) {
				input7.checked = /*showCtr*/ ctx[8];
			}

			if (dirty[0] & /*showCtaUta*/ 512) {
				input8.checked = /*showCtaUta*/ ctx[9];
			}

			if (dirty[0] & /*showRmz*/ 1024) {
				input9.checked = /*showRmz*/ ctx[10];
			}

			if (dirty[0] & /*showTmz*/ 2048) {
				input10.checked = /*showTmz*/ ctx[11];
			}

			if (dirty[0] & /*showAtz*/ 4096) {
				input11.checked = /*showAtz*/ ctx[12];
			}

			if (dirty[0] & /*showNavRadio*/ 1048576) {
				input12.checked = /*showNavRadio*/ ctx[20];
			}

			if (dirty[0] & /*showFis*/ 8192) {
				input13.checked = /*showFis*/ ctx[13];
			}

			if (dirty[0] & /*showSectors*/ 16384) {
				input14.checked = /*showSectors*/ ctx[14];
			}

			if (dirty[0] & /*showGlider*/ 32768) {
				input15.checked = /*showGlider*/ ctx[15];
			}

			if (dirty[0] & /*showUav*/ 65536) {
				input16.checked = /*showUav*/ ctx[16];
			}

			if (dirty[0] & /*showMilitary*/ 2097152) {
				input17.checked = /*showMilitary*/ ctx[21];
			}

			if (dirty[0] & /*showOther*/ 131072) {
				input18.checked = /*showOther*/ ctx[17];
			}

			if (dirty[0] & /*showMilitaryAll*/ 33554432) {
				input19.checked = /*showMilitaryAll*/ ctx[25];
			}

			if (dirty[0] & /*showSpecialZones*/ 4194304) {
				input20.checked = /*showSpecialZones*/ ctx[22];
			}

			if (dirty[0] & /*showInfoAreas*/ 8388608) {
				input21.checked = /*showInfoAreas*/ ctx[23];
			}

			if (dirty[0] & /*showSportUas*/ 16777216) {
				input22.checked = /*showSportUas*/ ctx[24];
			}

			if (dirty[0] & /*groupColors*/ 134217728 | dirty[1] & /*groups, groupLabel, handleColorInput*/ 14) {
				each_value = ensure_array_like(/*groups*/ ctx[32]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div11, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div14);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if_block3.d();
			if (if_block4) if_block4.d();
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

function isHexColor(value) {
	return typeof value === "string" && (/^#[0-9a-fA-F]{6}$/).test(value);
}

function airspaceType(feature) {
	return feature.properties.local_type || feature.properties.airspace_type || "";
}

function pointInRing(lon, lat, ring) {
	let inside = false;

	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const xi = ring[i][0], yi = ring[i][1];
		const xj = ring[j][0], yj = ring[j][1];
		const intersect = yi > lat !== yj > lat && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi;
		if (intersect) inside = !inside;
	}

	return inside;
}

function pointInPolygon(lon, lat, polygon) {
	if (!polygon || polygon.length === 0) return false;
	if (!pointInRing(lon, lat, polygon[0])) return false;

	for (let i = 1; i < polygon.length; i++) {
		if (pointInRing(lon, lat, polygon[i])) return false;
	}

	return true;
}

function featureContainsPoint(feature, lon, lat) {
	const geom = feature.geometry;
	if (!geom) return false;

	if (geom.type === "Polygon") {
		return pointInPolygon(lon, lat, geom.coordinates);
	}

	if (geom.type === "MultiPolygon") {
		return geom.coordinates.some(polygon => pointInPolygon(lon, lat, polygon));
	}

	return false;
}

function labelFor(feature) {
	const p = feature.properties;
	return p.label || p.designator || "Airspace";
}

function geometrySignature(feature) {
	try {
		const g = feature?.geometry;
		if (!g) return "no-geom";
		return `${g.type}:${JSON.stringify(g.coordinates).slice(0, 180)}`;
	} catch {
		return "geom-error";
	}
}

function featureId(feature) {
	const p = feature?.properties || {};
	const fid = feature?.id ?? p.id ?? p.source_uuid ?? p.uuid ?? p.gml_id ?? p.identifier;
	if (fid) return String(fid);

	return [
		p.designator || "",
		p.label || "",
		p.name || "",
		airspaceType(feature),
		p.lower_limit || "",
		p.upper_limit || "",
		geometrySignature(feature)
	].join("|");
}

const click_handler = e => e.stopPropagation();
const mousedown_handler = e => e.stopPropagation();
const keydown_handler = e => e.stopPropagation();
const keypress_handler = e => e.stopPropagation();
const keyup_handler = e => e.stopPropagation();
const click_handler_8 = e => e.stopPropagation();

function instance($$self, $$props, $$invalidate) {
	let currentFavorites;
	const L = window.L;
	let allData = window.__dfsAirspacesAllData || null;
	let layers = window.__dfsAirspacesLayers || {};
	let highlightLayer = window.__dfsAirspacesHighlight || null;
	let updateMessage = "";
	let foundAirspaces = [];
	let selectedFeature = null;
	let searchText = "";
	let searchResults = [];
	let uiState = window.__dfsAirspacesUI || {};
	let showRestricted = uiState.showRestricted ?? true;
	let showDanger = uiState.showDanger ?? true;
	let showProtect = uiState.showProtect ?? true;
	let showCtr = uiState.showCtr ?? false;
	let showCtaUta = uiState.showCtaUta ?? false;
	let showRmz = uiState.showRmz ?? false;
	let showTmz = uiState.showTmz ?? false;
	let showAtz = uiState.showAtz ?? false;
	let showFis = uiState.showFis ?? false;
	let showSectors = uiState.showSectors ?? false;
	let showGlider = uiState.showGlider ?? false;
	let showUav = uiState.showUav ?? false;
	let showOther = uiState.showOther ?? false;
	let showProhibited = uiState.showProhibited ?? false;
	let showTemporary = uiState.showTemporary ?? false;
	let showNavRadio = uiState.showNavRadio ?? false;
	let showMilitary = uiState.showMilitary ?? false;
	let showSpecialZones = uiState.showSpecialZones ?? false;
	let showInfoAreas = uiState.showInfoAreas ?? false;
	let showSportUas = uiState.showSportUas ?? false;
	let showMilitaryAll = uiState.showMilitaryAll ?? false;
	let showFavoritesOnly = uiState.showFavoritesOnly ?? false;

	function saveUIState() {
		window.__dfsAirspacesUI = {
			showRestricted,
			showDanger,
			showProtect,
			showCtr,
			showCtaUta,
			showRmz,
			showTmz,
			showAtz,
			showFis,
			showSectors,
			showGlider,
			showUav,
			showOther,
			showProhibited,
			showTemporary,
			showNavRadio,
			showMilitary,
			showSpecialZones,
			showInfoAreas,
			showSportUas,
			showMilitaryAll,
			showFavoritesOnly
		};
	}

	function handleToggleChange() {
		saveUIState();
		updateLayers();
	}

	function handleFavoritesChange() {
		if (showFavoritesOnly) {
			const favFeatures = favoriteFeatures(favoriteIds);

			let activeGroups = new Set(favFeatures.flatMap(f => {
					let groupsForFeature = groups.filter(g => belongsToGroup(f, g));
					return groupsForFeature;
				}));

			$$invalidate(5, showRestricted = activeGroups.has("restricted"));
			$$invalidate(6, showDanger = activeGroups.has("danger"));
			$$invalidate(7, showProtect = activeGroups.has("protect"));
			$$invalidate(8, showCtr = activeGroups.has("ctr"));
			$$invalidate(9, showCtaUta = activeGroups.has("cta_uta"));
			$$invalidate(10, showRmz = activeGroups.has("rmz"));
			$$invalidate(11, showTmz = activeGroups.has("tmz"));
			$$invalidate(12, showAtz = activeGroups.has("atz"));
			$$invalidate(13, showFis = activeGroups.has("fis"));
			$$invalidate(14, showSectors = activeGroups.has("sectors"));
			$$invalidate(15, showGlider = activeGroups.has("glider"));
			$$invalidate(16, showUav = activeGroups.has("uav"));
			$$invalidate(18, showProhibited = activeGroups.has("prohibited"));
			$$invalidate(19, showTemporary = activeGroups.has("temporary"));
			$$invalidate(20, showNavRadio = activeGroups.has("nav_radio"));
			$$invalidate(21, showMilitary = activeGroups.has("military"));
			$$invalidate(17, showOther = activeGroups.has("other"));
			$$invalidate(22, showSpecialZones = false);
			$$invalidate(23, showInfoAreas = false);
			$$invalidate(24, showSportUas = false);
			$$invalidate(25, showMilitaryAll = false);
		}

		handleToggleChange();
		updateSearch();
	}

	let favoriteIds = [];
	let favoriteIdSet = new Set();
	let isToggling = false;

	function setFavoriteIds(ids) {
		$$invalidate(43, favoriteIds = [...new Set(ids.map(String))]);
		favoriteIdSet = new Set(favoriteIds);
		$$invalidate(28, favoriteCount = favoriteIds.length);
	}

	const groups = [
		"restricted",
		"danger",
		"protect",
		"ctr",
		"cta_uta",
		"rmz",
		"tmz",
		"atz",
		"fis",
		"sectors",
		"glider",
		"uav",
		"prohibited",
		"temporary",
		"nav_radio",
		"military",
		"other"
	];

	const groupMeta = {
		restricted: {
			label: "Restricted / TRA / ED-R",
			color: "#000000",
			fillOpacity: 0.10
		},
		danger: {
			label: "Danger Areas",
			color: "#000000",
			fillOpacity: 0.08
		},
		protect: {
			label: "Protective Areas",
			color: "#000000",
			fillOpacity: 0.08
		},
		ctr: {
			label: "CTR (Control Zone)",
			color: "#000000",
			fillOpacity: 0.06
		},
		cta_uta: {
			label: "CTA / UTA",
			color: "#000000",
			fillOpacity: 0.04
		},
		rmz: {
			label: "RMZ",
			color: "#000000",
			fillOpacity: 0.05
		},
		tmz: {
			label: "TMZ",
			color: "#000000",
			fillOpacity: 0.05
		},
		atz: {
			label: "ATZ",
			color: "#000000",
			fillOpacity: 0.06
		},
		fis: {
			label: "Flight Information Sectors (FIS)",
			color: "#000000",
			fillOpacity: 0.03
		},
		sectors: {
			label: "Airspace Sectors",
			color: "#000000",
			fillOpacity: 0.03
		},
		glider: {
			label: "Glider Operating Areas",
			color: "#000000",
			fillOpacity: 0.05
		},
		uav: {
			label: "UAS / UAV Operating Areas",
			color: "#000000",
			fillOpacity: 0.05
		},
		prohibited: {
			label: "Prohibited Areas",
			color: "#8b0000",
			fillOpacity: 0.07
		},
		temporary: {
			label: "Temporary / NOTAM-based Airspace",
			color: "#ff8c00",
			fillOpacity: 0.05
		},
		nav_radio: {
			label: "Navigation / Radio-related Airspace",
			color: "#1e90ff",
			fillOpacity: 0.05
		},
		military: {
			label: "Military Activity Areas",
			color: "#556b2f",
			fillOpacity: 0.05
		},
		other: {
			label: "Other / Unclassified",
			color: "#555555",
			fillOpacity: 0.02
		}
	};

	function defaultGroupColors() {
		return Object.fromEntries(groups.map(group => [group, groupMeta[group].color]));
	}

	function loadGroupColors() {
		const defaults = defaultGroupColors();
		const cached = window.__dfsAirspacesGroupColors;

		if (cached && typeof cached === "object") {
			for (const group of groups) {
				if (isHexColor(cached[group])) defaults[group] = cached[group];
			}
		}

		try {
			const parsed = JSON.parse(localStorage.getItem("airspace-group-colors") || "{}");

			if (parsed && typeof parsed === "object") {
				for (const group of groups) {
					if (isHexColor(parsed[group])) defaults[group] = parsed[group];
				}
			}
		} catch {
			
		}

		return defaults;
	}

	let groupColors = loadGroupColors();

	function saveGroupColors() {
		window.__dfsAirspacesGroupColors = groupColors;
		localStorage.setItem("airspace-group-colors", JSON.stringify(groupColors));
	}

	function groupLabel(group) {
		return groupMeta[group]?.label || group;
	}

	function rebuildLayersFromData() {
		if (!allData) return;
		layers = {};

		for (const group of groups) {
			const meta = groupMeta[group];
			layers[group] = makeLayer(group, groupColors[group] || meta.color, meta.fillOpacity);
		}

		window.__dfsAirspacesLayers = layers;
	}

	function refreshLayerColors() {
		if (!allData) return;
		removeAllLayers();
		rebuildLayersFromData();
		updateLayers();
	}

	function handleColorChange(group, color) {
		if (!isHexColor(color)) return;
		$$invalidate(27, groupColors = { ...groupColors, [group]: color });
		saveGroupColors();
		refreshLayerColors();
	}

	function handleColorInput(group, e) {
		e.stopPropagation();
		const input = e.currentTarget;
		handleColorChange(group, input.value);
	}

	function resetGroupColors() {
		$$invalidate(27, groupColors = defaultGroupColors());
		saveGroupColors();
		refreshLayerColors();
	}

	function belongsToGroup(feature, group) {
		const p = feature.properties;
		const type = airspaceType(feature);
		if (group === "restricted") return p.category === "edr_outline" || ["OTHER:R_AMC", "R"].includes(type);
		if (group === "danger") return ["OTHER:D_AMC", "D_OTHER"].includes(type);
		if (group === "protect") return p.category === "military_protect_outline" || ["PROTECT", "MIL LOW FLYING AREA"].includes(type);
		if (group === "ctr") return ["CTR", "CTR_P"].includes(type);
		if (group === "cta_uta") return ["CTA", "UTA"].includes(type);
		if (group === "rmz") return type === "RMZ";
		if (group === "tmz") return type === "TMZ";
		if (group === "atz") return type === "ATZ";
		if (group === "fis") return type === "FLIGHT INFORMATION SECTOR";
		if (group === "sectors") return type === "SECTOR";
		if (group === "glider") return type === "GLD";
		if (group === "uav") return type === "UAV";
		if (group === "prohibited") return ["P", "PROHIBITED"].includes(type) || (/PROHIBITED/i).test(p.name || "");
		if (group === "temporary") return ["TEMPORARY", "NOTAM"].includes(type) || (/TEMP|NOTAM/i).test(`${p.name || ""} ${p.designator || ""}`);
		if (group === "nav_radio") return ["MTRA", "RADIO MANDATORY ZONE", "RMZ_TMZ_COMBINED"].includes(type) || (/RADIO|NAV|VOR|NDB/i).test(p.name || "");
		if (group === "military") return (/MIL|MILITARY|EXERCISE/i).test(`${type} ${p.name || ""}`);

		if (group === "other") {
			return !groups.filter(g => g !== "other").some(g => belongsToGroup(feature, g));
		}

		return false;
	}

	function isGroupVisible(group) {
		if (showFavoritesOnly) return true;
		if (showSpecialZones && (group === "rmz" || group === "tmz" || group === "atz")) return true;
		if (showInfoAreas && (group === "fis" || group === "sectors")) return true;
		if (showSportUas && (group === "glider" || group === "uav")) return true;
		if (showMilitaryAll && ["restricted", "danger", "protect", "military"].includes(group)) return true;
		if (group === "restricted") return showRestricted;
		if (group === "danger") return showDanger;
		if (group === "protect") return showProtect;
		if (group === "ctr") return showCtr;
		if (group === "cta_uta") return showCtaUta;
		if (group === "rmz") return showRmz;
		if (group === "tmz") return showTmz;
		if (group === "atz") return showAtz;
		if (group === "fis") return showFis;
		if (group === "sectors") return showSectors;
		if (group === "glider") return showGlider;
		if (group === "uav") return showUav;
		if (group === "prohibited") return showProhibited;
		if (group === "temporary") return showTemporary;
		if (group === "nav_radio") return showNavRadio;
		if (group === "military") return showMilitary;
		if (group === "other") return showOther;
		return false;
	}

	function isFavorite(feature) {
		return favoriteIdSet.has(featureId(feature));
	}

	function isFavoriteById(id) {
		return favoriteIdSet.has(id);
	}

	function favoriteFeatures(trackedIds) {
		if (!allData) return [];
		const used = new Set();
		const idSet = new Set(trackedIds);
		const result = [];

		for (const f of allData.features) {
			const id = String(featureId(f));

			if (idSet.has(id) && !used.has(id)) {
				used.add(id);
				result.push(f);
			}
		}

		return result.slice(0, 200);
	}

	let favoriteCount = 0;

	function loadFavorites() {
		try {
			const parsed = JSON.parse(localStorage.getItem("airspace-favorites") || "[]");
			setFavoriteIds(Array.isArray(parsed) ? parsed : []);

			if (allData) {
				const valid = new Set(allData.features.map(f => featureId(f)));
				setFavoriteIds(favoriteIds.filter(id => valid.has(id)));
			}
		} catch {
			setFavoriteIds([]);
		}
	}

	function saveFavorites() {
		localStorage.setItem("airspace-favorites", JSON.stringify(favoriteIds));
	}

	function refreshFavoriteViews() {
		updateSearch();

		if (allData) {
			$$invalidate(1, foundAirspaces = foundAirspaces.filter(f => isFeatureVisibleByFilters(f)));

			if (selectedFeature && !isFeatureVisibleByFilters(selectedFeature)) {
				$$invalidate(2, selectedFeature = null);
				removeHighlight();
			} else if (selectedFeature) {
				$$invalidate(2, selectedFeature = { ...selectedFeature });
			}
		}

		if (showFavoritesOnly) {
			updateLayers();
		} else {
			updateLayers();
		}
	}

	function toggleFavorite(feature, e) {
		e?.preventDefault();
		e?.stopPropagation();
		if (isToggling) return;
		isToggling = true;
		const id = String(featureId(feature));

		if (favoriteIds.includes(id)) {
			setFavoriteIds(favoriteIds.filter(x => x !== id));
		} else {
			setFavoriteIds([...favoriteIds, id]);
			ensureGroupIsVisible(feature);
		}

		saveFavorites();
		refreshFavoriteViews();

		setTimeout(
			() => {
				isToggling = false;
			},
			100
		);
	}

	function isFeatureVisibleByFilters(feature) {
		if (showFavoritesOnly) {
			return isFavorite(feature);
		}

		const byGroup = groups.some(group => isGroupVisible(group) && belongsToGroup(feature, group));
		if (!byGroup) return false;
		return true;
	}

	function updateSearch() {
		if (!allData) return;
		const text = searchText.trim().toLowerCase();

		if (!text) {
			$$invalidate(4, searchResults = []);
			return;
		}

		$$invalidate(4, searchResults = allData.features.filter(feature => {
			const p = feature.properties;
			const combined = `${p.label || ""} ${p.designator || ""} ${p.name || ""} ${p.local_type || ""} ${p.airspace_type || ""}`;
			const byText = combined.toLowerCase().includes(text);
			return byText;
		}).slice(0, 40));
	}

	function removeHighlight() {
		if (highlightLayer) {
			try {
				map.removeLayer(highlightLayer);
			} catch(e) {
				
			}

			highlightLayer = null;
			window.__dfsAirspacesHighlight = null;
		}
	}

	function ensureGroupIsVisible(feature) {
		if (!showFavoritesOnly) {
			for (const group of groups) {
				if (belongsToGroup(feature, group)) {
					if (group === "restricted") $$invalidate(5, showRestricted = true);
					if (group === "danger") $$invalidate(6, showDanger = true);
					if (group === "protect") $$invalidate(7, showProtect = true);
					if (group === "ctr") $$invalidate(8, showCtr = true);
					if (group === "cta_uta") $$invalidate(9, showCtaUta = true);
					if (group === "rmz") $$invalidate(10, showRmz = true);
					if (group === "tmz") $$invalidate(11, showTmz = true);
					if (group === "atz") $$invalidate(12, showAtz = true);
					if (group === "fis") $$invalidate(13, showFis = true);
					if (group === "sectors") $$invalidate(14, showSectors = true);
					if (group === "glider") $$invalidate(15, showGlider = true);
					if (group === "uav") $$invalidate(16, showUav = true);
					if (group === "prohibited") $$invalidate(18, showProhibited = true);
					if (group === "temporary") $$invalidate(19, showTemporary = true);
					if (group === "nav_radio") $$invalidate(20, showNavRadio = true);
					if (group === "military") $$invalidate(21, showMilitary = true);
					if (group === "other") $$invalidate(17, showOther = true);
				}
			}

			saveUIState();
		}
	}

	function highlightFeature(feature) {
		removeHighlight();
		ensureGroupIsVisible(feature);
		$$invalidate(2, selectedFeature = feature);

		highlightLayer = L.geoJSON(feature, {
			style: {
				color: "#ffff00",
				weight: 5,
				opacity: 1,
				fillColor: "#ffff00",
				fillOpacity: 0.28
			}
		});

		highlightLayer.addTo(map);
		window.__dfsAirspacesHighlight = highlightLayer;
	}

	function openInfoPopup(lat, lon, feature) {
		const p = feature.properties || {};

		const html = `
            <div style="font-size:12px;line-height:1.35;">
                <b>${labelFor(feature)}</b><br/>
                ${p.name || "-"}<br/><br/>
                <b>Type:</b> ${p.local_type || p.airspace_type || "-"}<br/>
                <b>Category:</b> ${p.category || "-"}<br/>
                <b>Lower limit:</b> ${p.lower_limit || "-"}<br/>
                <b>Upper limit:</b> ${p.upper_limit || "-"}
            </div>
        `;

		if (infoPopup) {
			try {
				map.closePopup(infoPopup);
			} catch(e) {
				
			}

			infoPopup = null;
		}

		infoPopup = L.popup({ closeButton: true, autoPan: true }).setLatLng([lat, lon]).setContent(html).openOn(map);
	}

	function handleMapClick(e) {
		if (!allData) return;
		const lat = e.latlng.lat;
		const lon = e.latlng.lng;
		$$invalidate(1, foundAirspaces = allData.features.filter(feature => isFeatureVisibleByFilters(feature) && featureContainsPoint(feature, lon, lat)));
		$$invalidate(2, selectedFeature = null);
		removeHighlight();
	}

	function handleMapContextMenu(e) {
		if (!allData) return;
		if (e?.originalEvent?.preventDefault) e.originalEvent.preventDefault();
		const lat = e.latlng.lat;
		const lon = e.latlng.lng;
		$$invalidate(1, foundAirspaces = allData.features.filter(feature => isFeatureVisibleByFilters(feature) && featureContainsPoint(feature, lon, lat)));

		if (foundAirspaces.length > 0) {
			$$invalidate(2, selectedFeature = foundAirspaces[0]);
			highlightFeature(selectedFeature);
			openInfoPopup(lat, lon, selectedFeature);
		} else {
			$$invalidate(2, selectedFeature = null);
			removeHighlight();

			if (infoPopup) {
				try {
					map.closePopup(infoPopup);
				} catch(e) {
					
				}

				infoPopup = null;
			}
		}
	}

	function makeLayer(group, color, fillOpacity) {
		const filtered = {
			type: "FeatureCollection",
			features: allData.features.filter(f => belongsToGroup(f, group))
		};

		return L.geoJSON(filtered, {
			style: {
				color,
				fillColor: color,
				weight: 2,
				opacity: 0.95,
				fillOpacity
			}
		});
	}

	function removeAllLayers() {
		for (const key in layers) {
			try {
				map.removeLayer(layers[key]);
			} catch(e) {
				
			}
		}

		removeHighlight();
	}

	function updateLayers() {
		if (!allData) return;
		removeAllLayers();

		for (const group of groups) {
			if (!isGroupVisible(group) || !layers[group]) continue;

			if (!showFavoritesOnly) {
				layers[group].addTo(map);
				continue;
			}

			const filtered = {
				type: "FeatureCollection",
				features: allData.features.filter(f => belongsToGroup(f, group) && isFavorite(f))
			};

			const favLayer = L.geoJSON(filtered, {
				style: layers[group].options?.style || {
					color: "#000",
					weight: 2,
					opacity: 0.95,
					fillOpacity: 0.08
				}
			});

			layers[`__fav_${group}`] = favLayer;
			favLayer.addTo(map);
		}

		if (selectedFeature && !isFeatureVisibleByFilters(selectedFeature)) {
			$$invalidate(2, selectedFeature = null);
			removeHighlight();
		}
	}

	let isRuntimeActive = false;
	let hasDataLoaded = !!allData;
	let infoPopup = null;

	async function checkForUpdates() {
		try {
			const response = await fetch("https://raw.githubusercontent.com/Fledervie/dfs-airspaces-project/main/backend-data/edr_from_aixm.geojson", { cache: "no-store" });
			if (!response.ok) return;
			const text = await response.text();

			if (allData && window.__dfsAirspacesRawData) {
				if (text !== window.__dfsAirspacesRawData) {
					console.log("DFS Airspaces Update detected!");
					$$invalidate(0, updateMessage = "DFS Airspaces were updated. New data was loaded seamlessly.");
					const newData = JSON.parse(text);
					$$invalidate(42, allData = newData);
					window.__dfsAirspacesAllData = allData;
					window.__dfsAirspacesRawData = text;
					const valid = new Set(allData.features.map(f => featureId(f)));
					setFavoriteIds(favoriteIds.filter(id => valid.has(id)));
					refreshLayerColors();
					updateSearch();

					setTimeout(
						() => {
							$$invalidate(0, updateMessage = "");
						},
						8000
					);
				}
			}
		} catch(e) {
			console.error("Failed to check for airspace updates:", e);
		}
	}

	let updateInterval;

	function ensureRuntimeAttached() {
		if (!isRuntimeActive) {
			map.on("click", handleMapClick);
			map.on("contextmenu", handleMapContextMenu);
			isRuntimeActive = true;
			updateInterval = setInterval(checkForUpdates, 1000 * 60 * 60 * 4);
		}
	}

	function destroyRuntime() {
		if (isRuntimeActive) {
			map.off("click", handleMapClick);
			map.off("contextmenu", handleMapContextMenu);
			isRuntimeActive = false;
			if (updateInterval) clearInterval(updateInterval);
		}

		removeAllLayers();

		if (infoPopup) {
			try {
				map.closePopup(infoPopup);
			} catch(e) {
				
			}

			infoPopup = null;
		}
	}

	onMount(async () => {
		loadFavorites();

		if (!hasDataLoaded) {
			const response = await fetch("https://raw.githubusercontent.com/Fledervie/dfs-airspaces-project/main/backend-data/edr_from_aixm.geojson");

			if (!response.ok) {
				alert("Load error: " + response.status);
				return;
			}

			const text = await response.text();
			window.__dfsAirspacesRawData = text;
			$$invalidate(42, allData = JSON.parse(text));
			window.__dfsAirspacesAllData = allData;
			rebuildLayersFromData();
			hasDataLoaded = true;
			const valid = new Set(allData.features.map(f => featureId(f)));
			setFavoriteIds(favoriteIds.filter(id => valid.has(id)));
		} else {
			checkForUpdates();
		}

		ensureRuntimeAttached();
		refreshLayerColors();
		const bounds = layers.restricted?.getBounds?.();
		if (bounds && bounds.isValid()) map.fitBounds(bounds);
		window.addEventListener("beforeunload", destroyRuntime);
	});

	onDestroy(() => {
		
	});

	function selectFeature(feature, e) {
		e?.preventDefault();
		e?.stopPropagation();
		$$invalidate(2, selectedFeature = feature);
		highlightFeature(feature);

		if (infoPopup) {
			try {
				map.closePopup(infoPopup);
			} catch(e) {
				
			}

			infoPopup = null;
		}
	}

	function input0_input_handler() {
		searchText = this.value;
		$$invalidate(3, searchText);
	}

	const input_handler = e => {
		e.stopPropagation();
		updateSearch();
	};

	function input1_change_handler() {
		showFavoritesOnly = this.checked;
		$$invalidate(26, showFavoritesOnly);
	}

	const click_handler_1 = (feature, e) => selectFeature(feature, e);
	const click_handler_2 = (feature, e) => toggleFavorite(feature, e);
	const click_handler_3 = feature => highlightFeature(feature);
	const click_handler_4 = (feature, e) => toggleFavorite(feature, e);
	const click_handler_5 = feature => highlightFeature(feature);
	const click_handler_6 = (feature, e) => toggleFavorite(feature, e);
	const click_handler_7 = e => toggleFavorite(selectedFeature, e);

	function input2_change_handler() {
		showRestricted = this.checked;
		$$invalidate(5, showRestricted);
	}

	function input3_change_handler() {
		showDanger = this.checked;
		$$invalidate(6, showDanger);
	}

	function input4_change_handler() {
		showProtect = this.checked;
		$$invalidate(7, showProtect);
	}

	function input5_change_handler() {
		showProhibited = this.checked;
		$$invalidate(18, showProhibited);
	}

	function input6_change_handler() {
		showTemporary = this.checked;
		$$invalidate(19, showTemporary);
	}

	function input7_change_handler() {
		showCtr = this.checked;
		$$invalidate(8, showCtr);
	}

	function input8_change_handler() {
		showCtaUta = this.checked;
		$$invalidate(9, showCtaUta);
	}

	function input9_change_handler() {
		showRmz = this.checked;
		$$invalidate(10, showRmz);
	}

	function input10_change_handler() {
		showTmz = this.checked;
		$$invalidate(11, showTmz);
	}

	function input11_change_handler() {
		showAtz = this.checked;
		$$invalidate(12, showAtz);
	}

	function input12_change_handler() {
		showNavRadio = this.checked;
		$$invalidate(20, showNavRadio);
	}

	function input13_change_handler() {
		showFis = this.checked;
		$$invalidate(13, showFis);
	}

	function input14_change_handler() {
		showSectors = this.checked;
		$$invalidate(14, showSectors);
	}

	function input15_change_handler() {
		showGlider = this.checked;
		$$invalidate(15, showGlider);
	}

	function input16_change_handler() {
		showUav = this.checked;
		$$invalidate(16, showUav);
	}

	function input17_change_handler() {
		showMilitary = this.checked;
		$$invalidate(21, showMilitary);
	}

	function input18_change_handler() {
		showOther = this.checked;
		$$invalidate(17, showOther);
	}

	function input19_change_handler() {
		showMilitaryAll = this.checked;
		$$invalidate(25, showMilitaryAll);
	}

	function input20_change_handler() {
		showSpecialZones = this.checked;
		$$invalidate(22, showSpecialZones);
	}

	function input21_change_handler() {
		showInfoAreas = this.checked;
		$$invalidate(23, showInfoAreas);
	}

	function input22_change_handler() {
		showSportUas = this.checked;
		$$invalidate(24, showSportUas);
	}

	const input_handler_1 = (group, e) => handleColorInput(group, e);

	$$self.$$.update = () => {
		if ($$self.$$.dirty[1] & /*allData, favoriteIds*/ 6144) {
			$$invalidate(29, currentFavorites = allData ? favoriteFeatures(favoriteIds) : []);
		}
	};

	return [
		updateMessage,
		foundAirspaces,
		selectedFeature,
		searchText,
		searchResults,
		showRestricted,
		showDanger,
		showProtect,
		showCtr,
		showCtaUta,
		showRmz,
		showTmz,
		showAtz,
		showFis,
		showSectors,
		showGlider,
		showUav,
		showOther,
		showProhibited,
		showTemporary,
		showNavRadio,
		showMilitary,
		showSpecialZones,
		showInfoAreas,
		showSportUas,
		showMilitaryAll,
		showFavoritesOnly,
		groupColors,
		favoriteCount,
		currentFavorites,
		handleToggleChange,
		handleFavoritesChange,
		groups,
		groupLabel,
		handleColorInput,
		resetGroupColors,
		isFavorite,
		isFavoriteById,
		toggleFavorite,
		updateSearch,
		highlightFeature,
		selectFeature,
		allData,
		favoriteIds,
		input0_input_handler,
		input_handler,
		input1_change_handler,
		click_handler_1,
		click_handler_2,
		click_handler_3,
		click_handler_4,
		click_handler_5,
		click_handler_6,
		click_handler_7,
		input2_change_handler,
		input3_change_handler,
		input4_change_handler,
		input5_change_handler,
		input6_change_handler,
		input7_change_handler,
		input8_change_handler,
		input9_change_handler,
		input10_change_handler,
		input11_change_handler,
		input12_change_handler,
		input13_change_handler,
		input14_change_handler,
		input15_change_handler,
		input16_change_handler,
		input17_change_handler,
		input18_change_handler,
		input19_change_handler,
		input20_change_handler,
		input21_change_handler,
		input22_change_handler,
		input_handler_1
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {}, add_css, [-1, -1, -1, -1]);
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
