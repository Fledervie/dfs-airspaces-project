const __pluginConfig =  {
  "name": "windy-plugin-dfs-airspaces",
  "version": "0.1.0",
  "icon": "✈",
  "title": "DFS Airspaces",
  "description": "DFS Airspaces",
  "author": "Fledervie",
  "repository": "https://github.com/Fledervie/dfs-airspace-data",
  "desktopUI": "rhpane",
  "mobileUI": "fullscreen",
  "routerPath": "/dfs-airspaces",
  "private": true,
  "built": 1781974081340,
  "builtReadable": "2026-06-20T16:48:01.340Z",
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
	append_styles(target, "svelte-14s8bld", ".plugin__content.svelte-14s8bld.svelte-14s8bld{padding:10px;overflow-x:hidden}label.svelte-14s8bld.svelte-14s8bld{display:block;margin:7px 0}.warning-banner.svelte-14s8bld.svelte-14s8bld{background-color:rgba(255, 60, 60, 0.15);border-left:4px solid #ff3c3c;border-radius:4px;padding:8px 10px;margin-bottom:12px;font-size:11px;line-height:1.4;color:#ffcccc}.credits-text.svelte-14s8bld.svelte-14s8bld{font-size:11px;opacity:0.7;margin-bottom:12px;padding:0 4px;text-align:center}.search-box.svelte-14s8bld.svelte-14s8bld{width:100%;padding:7px;margin-bottom:8px;box-sizing:border-box;border-radius:5px;border:1px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.08);color:inherit}.search-results.svelte-14s8bld.svelte-14s8bld{max-height:180px;overflow-y:auto;margin-bottom:10px;background:rgba(255,255,255,0.06);border-radius:6px;padding:5px}.info-box.svelte-14s8bld.svelte-14s8bld{background:rgba(255,255,255,0.1);border-radius:6px;padding:8px;margin-bottom:10px;min-height:160px;max-height:300px;overflow-y:auto}.detail-box.svelte-14s8bld.svelte-14s8bld{background:rgba(255,255,0,0.15);border-radius:6px;padding:8px;margin-bottom:10px;font-size:12px}.airspace-button.svelte-14s8bld.svelte-14s8bld{width:100%;text-align:left;margin:4px 0;padding:6px;border-radius:5px;border:1px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.08);color:inherit;cursor:pointer;font-size:12px}.airspace-button.svelte-14s8bld span.svelte-14s8bld{font-size:11px;opacity:0.8}.airspace-button.selected.svelte-14s8bld.svelte-14s8bld{background:rgba(255,255,0,0.28);border-color:rgba(255,255,0,0.8)}.cat-panel.svelte-14s8bld.svelte-14s8bld{margin:8px 0;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:rgba(255,255,255,0.04);overflow:hidden}.cat-header.svelte-14s8bld.svelte-14s8bld{list-style:none;cursor:pointer;padding:8px 10px;font-weight:600;background:rgba(255,255,255,0.10);user-select:none}.cat-header.svelte-14s8bld.svelte-14s8bld::-webkit-details-marker{display:none}.cat-body.svelte-14s8bld.svelte-14s8bld{padding:6px 10px 8px 10px;border-top:1px solid rgba(255,255,255,0.12);position:relative;z-index:0}.fav-btn.svelte-14s8bld.svelte-14s8bld{width:100%;margin-top:4px;margin-bottom:6px;padding:5px 6px;border-radius:5px;border:1px solid rgba(255,255,255,0.25);background:rgba(255,215,0,0.15);color:inherit;cursor:pointer;font-size:11px;text-align:left}.fav-btn.active.svelte-14s8bld.svelte-14s8bld{background:rgba(255, 215, 0, 0.45);border-color:rgba(255, 215, 0, 0.95);box-shadow:inset 0 0 0 1px rgba(255, 215, 0, 0.35);font-weight:700}.result-row.svelte-14s8bld.svelte-14s8bld{display:block}.fav-btn.fav-inline.svelte-14s8bld.svelte-14s8bld{display:flex;align-items:center;gap:6px;justify-content:flex-start}.fav-icon.svelte-14s8bld.svelte-14s8bld{font-size:14px;line-height:1;width:14px;text-align:center}.fav-btn.fav-inline.active.svelte-14s8bld.svelte-14s8bld,.fav-btn.fav-inline[aria-pressed=\"true\"].svelte-14s8bld.svelte-14s8bld{background:rgba(255, 215, 0, 0.55) !important;border-color:rgba(255, 215, 0, 1) !important;color:#111 !important;font-weight:700}.fav-btn.fav-inline.active.svelte-14s8bld .fav-icon.svelte-14s8bld,.fav-btn.fav-inline[aria-pressed=\"true\"].svelte-14s8bld .fav-icon.svelte-14s8bld{color:#8a5a00}.favorites-list.svelte-14s8bld.svelte-14s8bld{margin-top:8px;max-height:220px;overflow-y:auto}.favorite-row.svelte-14s8bld.svelte-14s8bld{margin-bottom:6px}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[98] = list[i];
	child_ctx[100] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[98] = list[i];
	const constants_0 = featureId(/*feature*/ child_ctx[98]);
	child_ctx[101] = constants_0;
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[98] = list[i];
	return child_ctx;
}

// (648:12) {#if favoriteCount > 0}
function create_if_block_3(ctx) {
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let each_value_2 = ensure_array_like(/*currentFavorites*/ ctx[27]);
	const get_key = ctx => featureId(/*feature*/ ctx[98]);

	for (let i = 0; i < each_value_2.length; i += 1) {
		let child_ctx = get_each_context_2(ctx, each_value_2, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "favorites-list svelte-14s8bld");
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
			if (dirty[0] & /*isFavorite, currentFavorites, selectedFeature*/ 1207959554 | dirty[1] & /*toggleFavorite, selectFeature*/ 18) {
				each_value_2 = ensure_array_like(/*currentFavorites*/ ctx[27]);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, div, destroy_block, create_each_block_2, null, get_each_context_2);
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

// (650:20) {#each currentFavorites as feature (featureId(feature))}
function create_each_block_2(key_1, ctx) {
	let div;
	let button0;
	let t0_value = labelFor(/*feature*/ ctx[98]) + "";
	let t0;
	let br;
	let t1;
	let span0;
	let t2_value = (/*feature*/ ctx[98].properties.name || "-") + "";
	let t2;
	let t3;
	let button1;
	let span1;
	let t4_value = (/*isFavorite*/ ctx[30](/*feature*/ ctx[98]) ? "★" : "☆") + "";
	let t4;
	let t5;

	let t6_value = (/*isFavorite*/ ctx[30](/*feature*/ ctx[98])
	? "Favorited (Click to remove)"
	: "Add to Favorites") + "";

	let t6;
	let button1_aria_pressed_value;
	let t7;
	let mounted;
	let dispose;

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[41](/*feature*/ ctx[98], ...args);
	}

	function click_handler_2(...args) {
		return /*click_handler_2*/ ctx[42](/*feature*/ ctx[98], ...args);
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
			attr(span0, "class", "svelte-14s8bld");
			attr(button0, "class", "airspace-button svelte-14s8bld");
			toggle_class(button0, "selected", /*selectedFeature*/ ctx[1] && featureId(/*selectedFeature*/ ctx[1]) === featureId(/*feature*/ ctx[98]));
			attr(span1, "class", "fav-icon svelte-14s8bld");
			attr(button1, "class", "fav-btn fav-inline svelte-14s8bld");
			attr(button1, "aria-pressed", button1_aria_pressed_value = /*isFavorite*/ ctx[30](/*feature*/ ctx[98]));
			toggle_class(button1, "active", /*isFavorite*/ ctx[30](/*feature*/ ctx[98]));
			attr(div, "class", "favorite-row svelte-14s8bld");
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
			if (dirty[0] & /*currentFavorites*/ 134217728 && t0_value !== (t0_value = labelFor(/*feature*/ ctx[98]) + "")) set_data(t0, t0_value);
			if (dirty[0] & /*currentFavorites*/ 134217728 && t2_value !== (t2_value = (/*feature*/ ctx[98].properties.name || "-") + "")) set_data(t2, t2_value);

			if (dirty[0] & /*selectedFeature, currentFavorites*/ 134217730) {
				toggle_class(button0, "selected", /*selectedFeature*/ ctx[1] && featureId(/*selectedFeature*/ ctx[1]) === featureId(/*feature*/ ctx[98]));
			}

			if (dirty[0] & /*currentFavorites*/ 134217728 && t4_value !== (t4_value = (/*isFavorite*/ ctx[30](/*feature*/ ctx[98]) ? "★" : "☆") + "")) set_data(t4, t4_value);

			if (dirty[0] & /*currentFavorites*/ 134217728 && t6_value !== (t6_value = (/*isFavorite*/ ctx[30](/*feature*/ ctx[98])
			? "Favorited (Click to remove)"
			: "Add to Favorites") + "")) set_data(t6, t6_value);

			if (dirty[0] & /*currentFavorites*/ 134217728 && button1_aria_pressed_value !== (button1_aria_pressed_value = /*isFavorite*/ ctx[30](/*feature*/ ctx[98]))) {
				attr(button1, "aria-pressed", button1_aria_pressed_value);
			}

			if (dirty[0] & /*isFavorite, currentFavorites*/ 1207959552) {
				toggle_class(button1, "active", /*isFavorite*/ ctx[30](/*feature*/ ctx[98]));
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

// (676:4) {#if searchResults.length > 0}
function create_if_block_2(ctx) {
	let div;
	let each_value_1 = ensure_array_like(/*searchResults*/ ctx[3]);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "search-results svelte-14s8bld");
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
			if (dirty[0] & /*searchResults, selectedFeature*/ 10 | dirty[1] & /*isFavoriteById, toggleFavorite, highlightFeature*/ 11) {
				each_value_1 = ensure_array_like(/*searchResults*/ ctx[3]);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
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

// (678:12) {#each searchResults as feature}
function create_each_block_1(ctx) {
	let div;
	let button0;
	let t0_value = labelFor(/*feature*/ ctx[98]) + "";
	let t0;
	let br;
	let span0;
	let t1_value = (/*feature*/ ctx[98].properties.name || "-") + "";
	let t1;
	let t2;
	let button1;
	let span1;

	let t3_value = (/*isFavoriteById*/ ctx[31](/*favId*/ ctx[101])
	? "★"
	: "☆") + "";

	let t3;
	let t4;

	let t5_value = (/*isFavoriteById*/ ctx[31](/*favId*/ ctx[101])
	? "Favorited"
	: "Add to Favorites") + "";

	let t5;
	let button1_aria_pressed_value;
	let t6;
	let mounted;
	let dispose;

	function click_handler_3() {
		return /*click_handler_3*/ ctx[43](/*feature*/ ctx[98]);
	}

	function click_handler_4(...args) {
		return /*click_handler_4*/ ctx[44](/*feature*/ ctx[98], ...args);
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
			attr(span0, "class", "svelte-14s8bld");
			attr(button0, "class", "airspace-button svelte-14s8bld");
			toggle_class(button0, "selected", /*selectedFeature*/ ctx[1] === /*feature*/ ctx[98]);
			attr(span1, "class", "fav-icon svelte-14s8bld");
			attr(button1, "class", "fav-btn fav-inline svelte-14s8bld");
			attr(button1, "aria-pressed", button1_aria_pressed_value = /*isFavoriteById*/ ctx[31](/*favId*/ ctx[101]));
			toggle_class(button1, "active", /*isFavoriteById*/ ctx[31](/*favId*/ ctx[101]));
			attr(div, "class", "result-row svelte-14s8bld");
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
			if (dirty[0] & /*searchResults*/ 8 && t0_value !== (t0_value = labelFor(/*feature*/ ctx[98]) + "")) set_data(t0, t0_value);
			if (dirty[0] & /*searchResults*/ 8 && t1_value !== (t1_value = (/*feature*/ ctx[98].properties.name || "-") + "")) set_data(t1, t1_value);

			if (dirty[0] & /*selectedFeature, searchResults*/ 10) {
				toggle_class(button0, "selected", /*selectedFeature*/ ctx[1] === /*feature*/ ctx[98]);
			}

			if (dirty[0] & /*searchResults*/ 8 && t3_value !== (t3_value = (/*isFavoriteById*/ ctx[31](/*favId*/ ctx[101])
			? "★"
			: "☆") + "")) set_data(t3, t3_value);

			if (dirty[0] & /*searchResults*/ 8 && t5_value !== (t5_value = (/*isFavoriteById*/ ctx[31](/*favId*/ ctx[101])
			? "Favorited"
			: "Add to Favorites") + "")) set_data(t5, t5_value);

			if (dirty[0] & /*searchResults*/ 8 && button1_aria_pressed_value !== (button1_aria_pressed_value = /*isFavoriteById*/ ctx[31](/*favId*/ ctx[101]))) {
				attr(button1, "aria-pressed", button1_aria_pressed_value);
			}

			if (dirty[0] & /*searchResults*/ 8 | dirty[1] & /*isFavoriteById*/ 1) {
				toggle_class(button1, "active", /*isFavoriteById*/ ctx[31](/*favId*/ ctx[101]));
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

// (701:8) {:else}
function create_else_block(ctx) {
	let p;
	let b;
	let t0;
	let t1_value = /*foundAirspaces*/ ctx[0].length + "";
	let t1;
	let t2;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let each_1_anchor;
	let each_value = ensure_array_like(/*foundAirspaces*/ ctx[0].slice(0, 30));
	const get_key = ctx => featureId(/*feature*/ ctx[98]);

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
	}

	return {
		c() {
			p = element("p");
			b = element("b");
			t0 = text("Gefundene Lufträume: ");
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
			if (dirty[0] & /*foundAirspaces*/ 1 && t1_value !== (t1_value = /*foundAirspaces*/ ctx[0].length + "")) set_data(t1, t1_value);

			if (dirty[0] & /*isFavorite, foundAirspaces, selectedFeature*/ 1073741827 | dirty[1] & /*toggleFavorite, highlightFeature*/ 10) {
				each_value = ensure_array_like(/*foundAirspaces*/ ctx[0].slice(0, 30));
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block, each_1_anchor, get_each_context);
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

// (699:8) {#if foundAirspaces.length === 0}
function create_if_block_1(ctx) {
	let p;

	return {
		c() {
			p = element("p");
			p.textContent = "Klicke auf die Karte, um Lufträume an dieser Position anzuzeigen.";
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

// (704:12) {#each foundAirspaces.slice(0, 30) as feature, index (featureId(feature))}
function create_each_block(key_1, ctx) {
	let div;
	let button0;
	let t0_value = /*index*/ ctx[100] + 1 + "";
	let t0;
	let t1;
	let t2_value = labelFor(/*feature*/ ctx[98]) + "";
	let t2;
	let br;
	let span0;
	let t3_value = (/*feature*/ ctx[98].properties.name || "-") + "";
	let t3;
	let t4;
	let button1;
	let span1;
	let t5_value = (/*isFavorite*/ ctx[30](/*feature*/ ctx[98]) ? "★" : "☆") + "";
	let t5;
	let t6;

	let t7_value = (/*isFavorite*/ ctx[30](/*feature*/ ctx[98])
	? "Favorited"
	: "Add to Favorites") + "";

	let t7;
	let button1_aria_pressed_value;
	let t8;
	let mounted;
	let dispose;

	function click_handler_5() {
		return /*click_handler_5*/ ctx[45](/*feature*/ ctx[98]);
	}

	function click_handler_6(...args) {
		return /*click_handler_6*/ ctx[46](/*feature*/ ctx[98], ...args);
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
			attr(span0, "class", "svelte-14s8bld");
			attr(button0, "class", "airspace-button svelte-14s8bld");
			toggle_class(button0, "selected", /*selectedFeature*/ ctx[1] === /*feature*/ ctx[98]);
			attr(span1, "class", "fav-icon svelte-14s8bld");
			attr(button1, "class", "fav-btn fav-inline svelte-14s8bld");
			attr(button1, "aria-pressed", button1_aria_pressed_value = /*isFavorite*/ ctx[30](/*feature*/ ctx[98]));
			toggle_class(button1, "active", /*isFavorite*/ ctx[30](/*feature*/ ctx[98]));
			attr(div, "class", "result-row svelte-14s8bld");
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
			if (dirty[0] & /*foundAirspaces*/ 1 && t0_value !== (t0_value = /*index*/ ctx[100] + 1 + "")) set_data(t0, t0_value);
			if (dirty[0] & /*foundAirspaces*/ 1 && t2_value !== (t2_value = labelFor(/*feature*/ ctx[98]) + "")) set_data(t2, t2_value);
			if (dirty[0] & /*foundAirspaces*/ 1 && t3_value !== (t3_value = (/*feature*/ ctx[98].properties.name || "-") + "")) set_data(t3, t3_value);

			if (dirty[0] & /*selectedFeature, foundAirspaces*/ 3) {
				toggle_class(button0, "selected", /*selectedFeature*/ ctx[1] === /*feature*/ ctx[98]);
			}

			if (dirty[0] & /*foundAirspaces*/ 1 && t5_value !== (t5_value = (/*isFavorite*/ ctx[30](/*feature*/ ctx[98]) ? "★" : "☆") + "")) set_data(t5, t5_value);

			if (dirty[0] & /*foundAirspaces*/ 1 && t7_value !== (t7_value = (/*isFavorite*/ ctx[30](/*feature*/ ctx[98])
			? "Favorited"
			: "Add to Favorites") + "")) set_data(t7, t7_value);

			if (dirty[0] & /*foundAirspaces*/ 1 && button1_aria_pressed_value !== (button1_aria_pressed_value = /*isFavorite*/ ctx[30](/*feature*/ ctx[98]))) {
				attr(button1, "aria-pressed", button1_aria_pressed_value);
			}

			if (dirty[0] & /*isFavorite, foundAirspaces*/ 1073741825) {
				toggle_class(button1, "active", /*isFavorite*/ ctx[30](/*feature*/ ctx[98]));
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

// (723:4) {#if selectedFeature}
function create_if_block(ctx) {
	let div;
	let b;
	let t0_value = labelFor(/*selectedFeature*/ ctx[1]) + "";
	let t0;
	let br0;
	let t1;
	let t2_value = (/*selectedFeature*/ ctx[1].properties.name || "-") + "";
	let t2;
	let br1;
	let br2;
	let t3;
	let t4_value = (/*selectedFeature*/ ctx[1].properties.local_type || /*selectedFeature*/ ctx[1].properties.airspace_type || "-") + "";
	let t4;
	let br3;
	let t5;
	let t6_value = (/*selectedFeature*/ ctx[1].properties.category || "-") + "";
	let t6;
	let br4;
	let t7;
	let t8_value = (/*selectedFeature*/ ctx[1].properties.lower_limit || "-") + "";
	let t8;
	let br5;
	let t9;
	let t10_value = (/*selectedFeature*/ ctx[1].properties.upper_limit || "-") + "";
	let t10;
	let br6;
	let t11;
	let button;

	let t12_value = (/*isFavorite*/ ctx[30](/*selectedFeature*/ ctx[1])
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
			t3 = text("\n\n            Typ: ");
			t4 = text(t4_value);
			br3 = element("br");
			t5 = text("\n            Kategorie: ");
			t6 = text(t6_value);
			br4 = element("br");
			t7 = text("\n            Untergrenze: ");
			t8 = text(t8_value);
			br5 = element("br");
			t9 = text("\n            Obergrenze: ");
			t10 = text(t10_value);
			br6 = element("br");
			t11 = space();
			button = element("button");
			t12 = text(t12_value);
			attr(button, "class", "fav-btn svelte-14s8bld");
			attr(button, "aria-pressed", button_aria_pressed_value = /*isFavorite*/ ctx[30](/*selectedFeature*/ ctx[1]));
			toggle_class(button, "active", /*isFavorite*/ ctx[30](/*selectedFeature*/ ctx[1]));
			attr(div, "class", "detail-box svelte-14s8bld");
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
				dispose = listen(button, "click", /*click_handler_7*/ ctx[47]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*selectedFeature*/ 2 && t0_value !== (t0_value = labelFor(/*selectedFeature*/ ctx[1]) + "")) set_data(t0, t0_value);
			if (dirty[0] & /*selectedFeature*/ 2 && t2_value !== (t2_value = (/*selectedFeature*/ ctx[1].properties.name || "-") + "")) set_data(t2, t2_value);
			if (dirty[0] & /*selectedFeature*/ 2 && t4_value !== (t4_value = (/*selectedFeature*/ ctx[1].properties.local_type || /*selectedFeature*/ ctx[1].properties.airspace_type || "-") + "")) set_data(t4, t4_value);
			if (dirty[0] & /*selectedFeature*/ 2 && t6_value !== (t6_value = (/*selectedFeature*/ ctx[1].properties.category || "-") + "")) set_data(t6, t6_value);
			if (dirty[0] & /*selectedFeature*/ 2 && t8_value !== (t8_value = (/*selectedFeature*/ ctx[1].properties.lower_limit || "-") + "")) set_data(t8, t8_value);
			if (dirty[0] & /*selectedFeature*/ 2 && t10_value !== (t10_value = (/*selectedFeature*/ ctx[1].properties.upper_limit || "-") + "")) set_data(t10, t10_value);

			if (dirty[0] & /*selectedFeature*/ 2 && t12_value !== (t12_value = (/*isFavorite*/ ctx[30](/*selectedFeature*/ ctx[1])
			? "★ Remove Favorite"
			: "☆ Add Favorite") + "")) set_data(t12, t12_value);

			if (dirty[0] & /*selectedFeature*/ 2 && button_aria_pressed_value !== (button_aria_pressed_value = /*isFavorite*/ ctx[30](/*selectedFeature*/ ctx[1]))) {
				attr(button, "aria-pressed", button_aria_pressed_value);
			}

			if (dirty[0] & /*isFavorite, selectedFeature*/ 1073741826) {
				toggle_class(button, "active", /*isFavorite*/ ctx[30](/*selectedFeature*/ ctx[1]));
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

function create_fragment(ctx) {
	let div11;
	let h2;
	let t1;
	let div0;
	let t5;
	let div1;
	let t7;
	let input0;
	let t8;
	let details0;
	let summary0;
	let t10;
	let div3;
	let label0;
	let input1;
	let t11;
	let t12;
	let div2;
	let t13;
	let t14;
	let t15;
	let t16;
	let t17;
	let div4;
	let t18;
	let t19;
	let details1;
	let summary1;
	let t21;
	let div5;
	let label1;
	let input2;
	let t22;
	let t23;
	let label2;
	let input3;
	let t24;
	let t25;
	let label3;
	let input4;
	let t26;
	let t27;
	let label4;
	let input5;
	let t28;
	let t29;
	let label5;
	let input6;
	let t30;
	let t31;
	let details2;
	let summary2;
	let t33;
	let div6;
	let label6;
	let input7;
	let t34;
	let t35;
	let label7;
	let input8;
	let t36;
	let t37;
	let details3;
	let summary3;
	let t39;
	let div7;
	let label8;
	let input9;
	let t40;
	let t41;
	let label9;
	let input10;
	let t42;
	let t43;
	let label10;
	let input11;
	let t44;
	let t45;
	let label11;
	let input12;
	let t46;
	let t47;
	let details4;
	let summary4;
	let t49;
	let div8;
	let label12;
	let input13;
	let t50;
	let t51;
	let label13;
	let input14;
	let t52;
	let t53;
	let label14;
	let input15;
	let t54;
	let t55;
	let label15;
	let input16;
	let t56;
	let t57;
	let label16;
	let input17;
	let t58;
	let t59;
	let details5;
	let summary5;
	let t61;
	let div9;
	let label17;
	let input18;
	let t62;
	let t63;
	let details6;
	let summary6;
	let t65;
	let div10;
	let label18;
	let input19;
	let t66;
	let t67;
	let label19;
	let input20;
	let t68;
	let t69;
	let label20;
	let input21;
	let t70;
	let t71;
	let label21;
	let input22;
	let t72;
	let mounted;
	let dispose;
	let if_block0 = /*favoriteCount*/ ctx[26] > 0 && create_if_block_3(ctx);
	let if_block1 = /*searchResults*/ ctx[3].length > 0 && create_if_block_2(ctx);

	function select_block_type(ctx, dirty) {
		if (/*foundAirspaces*/ ctx[0].length === 0) return create_if_block_1;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block2 = current_block_type(ctx);
	let if_block3 = /*selectedFeature*/ ctx[1] && create_if_block(ctx);

	return {
		c() {
			div11 = element("div");
			h2 = element("h2");
			h2.textContent = "DFS Airspaces";
			t1 = space();
			div0 = element("div");

			div0.innerHTML = `<strong>⚠️ WARNING - NOT FOR REAL NAVIGATION!</strong><br/>
        Data source: DFS Deutsche Flugsicherung GmbH.<br/>
        No guarantee for accuracy, completeness, or timeliness.`;

			t5 = space();
			div1 = element("div");
			div1.innerHTML = `<em>Plugin UI by Fledervie | GeoJSON Parser by Lucas Wankerl</em>`;
			t7 = space();
			input0 = element("input");
			t8 = space();
			details0 = element("details");
			summary0 = element("summary");
			summary0.textContent = "Favorites";
			t10 = space();
			div3 = element("div");
			label0 = element("label");
			input1 = element("input");
			t11 = text("\n                Show Favorites Only");
			t12 = space();
			div2 = element("div");
			t13 = text("Saved: ");
			t14 = text(/*favoriteCount*/ ctx[26]);
			t15 = space();
			if (if_block0) if_block0.c();
			t16 = space();
			if (if_block1) if_block1.c();
			t17 = space();
			div4 = element("div");
			if_block2.c();
			t18 = space();
			if (if_block3) if_block3.c();
			t19 = space();
			details1 = element("details");
			summary1 = element("summary");
			summary1.textContent = "Core Airspace Restrictions";
			t21 = space();
			div5 = element("div");
			label1 = element("label");
			input2 = element("input");
			t22 = text(" Restricted / TRA / ED-R");
			t23 = space();
			label2 = element("label");
			input3 = element("input");
			t24 = text(" Danger Areas");
			t25 = space();
			label3 = element("label");
			input4 = element("input");
			t26 = text(" Protective Areas");
			t27 = space();
			label4 = element("label");
			input5 = element("input");
			t28 = text(" Prohibited Areas");
			t29 = space();
			label5 = element("label");
			input6 = element("input");
			t30 = text(" Temporary / NOTAM-based Airspace");
			t31 = space();
			details2 = element("details");
			summary2 = element("summary");
			summary2.textContent = "Controlled Airspace";
			t33 = space();
			div6 = element("div");
			label6 = element("label");
			input7 = element("input");
			t34 = text(" CTR (Control Zone)");
			t35 = space();
			label7 = element("label");
			input8 = element("input");
			t36 = text(" CTA / UTA");
			t37 = space();
			details3 = element("details");
			summary3 = element("summary");
			summary3.textContent = "Special Use Airspace";
			t39 = space();
			div7 = element("div");
			label8 = element("label");
			input9 = element("input");
			t40 = text(" RMZ");
			t41 = space();
			label9 = element("label");
			input10 = element("input");
			t42 = text(" TMZ");
			t43 = space();
			label10 = element("label");
			input11 = element("input");
			t44 = text(" ATZ");
			t45 = space();
			label11 = element("label");
			input12 = element("input");
			t46 = text(" Navigation / Radio-related Airspace");
			t47 = space();
			details4 = element("details");
			summary4 = element("summary");
			summary4.textContent = "Operational Structure & Use";
			t49 = space();
			div8 = element("div");
			label12 = element("label");
			input13 = element("input");
			t50 = text(" Flight Information Sectors (FIS)");
			t51 = space();
			label13 = element("label");
			input14 = element("input");
			t52 = text(" Airspace Sectors");
			t53 = space();
			label14 = element("label");
			input15 = element("input");
			t54 = text(" Glider Operating Areas");
			t55 = space();
			label15 = element("label");
			input16 = element("input");
			t56 = text(" UAS / UAV Operating Areas");
			t57 = space();
			label16 = element("label");
			input17 = element("input");
			t58 = text(" Military Activity Areas");
			t59 = space();
			details5 = element("details");
			summary5 = element("summary");
			summary5.textContent = "Residual Classification";
			t61 = space();
			div9 = element("div");
			label17 = element("label");
			input18 = element("input");
			t62 = text(" Other / Unclassified");
			t63 = space();
			details6 = element("details");
			summary6 = element("summary");
			summary6.textContent = "Aggregate Toggles";
			t65 = space();
			div10 = element("div");
			label18 = element("label");
			input19 = element("input");
			t66 = text(" Military Aggregate (Restricted/Danger/Protect/Military)");
			t67 = space();
			label19 = element("label");
			input20 = element("input");
			t68 = text(" Special Zone Aggregate (RMZ/TMZ/ATZ)");
			t69 = space();
			label20 = element("label");
			input21 = element("input");
			t70 = text(" Information Aggregate (FIS/Sector)");
			t71 = space();
			label21 = element("label");
			input22 = element("input");
			t72 = text(" Recreational/Unmanned Aggregate (Glider/UAV)");
			attr(div0, "class", "warning-banner svelte-14s8bld");
			attr(div1, "class", "credits-text svelte-14s8bld");
			attr(input0, "class", "search-box svelte-14s8bld");
			attr(input0, "type", "text");
			attr(input0, "placeholder", "Suche: EDR201, TRA Friesland, RMZ...");
			attr(summary0, "class", "cat-header svelte-14s8bld");
			attr(input1, "type", "checkbox");
			attr(label0, "class", "svelte-14s8bld");
			set_style(div2, "font-size", "11px");
			set_style(div2, "opacity", "0.8");
			attr(div3, "class", "cat-body svelte-14s8bld");
			attr(details0, "class", "cat-panel svelte-14s8bld");
			attr(div4, "class", "info-box svelte-14s8bld");
			attr(summary1, "class", "cat-header svelte-14s8bld");
			attr(input2, "type", "checkbox");
			attr(label1, "class", "svelte-14s8bld");
			attr(input3, "type", "checkbox");
			attr(label2, "class", "svelte-14s8bld");
			attr(input4, "type", "checkbox");
			attr(label3, "class", "svelte-14s8bld");
			attr(input5, "type", "checkbox");
			attr(label4, "class", "svelte-14s8bld");
			attr(input6, "type", "checkbox");
			attr(label5, "class", "svelte-14s8bld");
			attr(div5, "class", "cat-body svelte-14s8bld");
			attr(details1, "class", "cat-panel svelte-14s8bld");
			details1.open = true;
			attr(summary2, "class", "cat-header svelte-14s8bld");
			attr(input7, "type", "checkbox");
			attr(label6, "class", "svelte-14s8bld");
			attr(input8, "type", "checkbox");
			attr(label7, "class", "svelte-14s8bld");
			attr(div6, "class", "cat-body svelte-14s8bld");
			attr(details2, "class", "cat-panel svelte-14s8bld");
			attr(summary3, "class", "cat-header svelte-14s8bld");
			attr(input9, "type", "checkbox");
			attr(label8, "class", "svelte-14s8bld");
			attr(input10, "type", "checkbox");
			attr(label9, "class", "svelte-14s8bld");
			attr(input11, "type", "checkbox");
			attr(label10, "class", "svelte-14s8bld");
			attr(input12, "type", "checkbox");
			attr(label11, "class", "svelte-14s8bld");
			attr(div7, "class", "cat-body svelte-14s8bld");
			attr(details3, "class", "cat-panel svelte-14s8bld");
			attr(summary4, "class", "cat-header svelte-14s8bld");
			attr(input13, "type", "checkbox");
			attr(label12, "class", "svelte-14s8bld");
			attr(input14, "type", "checkbox");
			attr(label13, "class", "svelte-14s8bld");
			attr(input15, "type", "checkbox");
			attr(label14, "class", "svelte-14s8bld");
			attr(input16, "type", "checkbox");
			attr(label15, "class", "svelte-14s8bld");
			attr(input17, "type", "checkbox");
			attr(label16, "class", "svelte-14s8bld");
			attr(div8, "class", "cat-body svelte-14s8bld");
			attr(details4, "class", "cat-panel svelte-14s8bld");
			attr(summary5, "class", "cat-header svelte-14s8bld");
			attr(input18, "type", "checkbox");
			attr(label17, "class", "svelte-14s8bld");
			attr(div9, "class", "cat-body svelte-14s8bld");
			attr(details5, "class", "cat-panel svelte-14s8bld");
			attr(summary6, "class", "cat-header svelte-14s8bld");
			attr(input19, "type", "checkbox");
			attr(label18, "class", "svelte-14s8bld");
			attr(input20, "type", "checkbox");
			attr(label19, "class", "svelte-14s8bld");
			attr(input21, "type", "checkbox");
			attr(label20, "class", "svelte-14s8bld");
			attr(input22, "type", "checkbox");
			attr(label21, "class", "svelte-14s8bld");
			attr(div10, "class", "cat-body svelte-14s8bld");
			attr(details6, "class", "cat-panel svelte-14s8bld");
			attr(div11, "class", "plugin__content svelte-14s8bld");
		},
		m(target, anchor) {
			insert(target, div11, anchor);
			append(div11, h2);
			append(div11, t1);
			append(div11, div0);
			append(div11, t5);
			append(div11, div1);
			append(div11, t7);
			append(div11, input0);
			set_input_value(input0, /*searchText*/ ctx[2]);
			append(div11, t8);
			append(div11, details0);
			append(details0, summary0);
			append(details0, t10);
			append(details0, div3);
			append(div3, label0);
			append(label0, input1);
			input1.checked = /*showFavoritesOnly*/ ctx[25];
			append(label0, t11);
			append(div3, t12);
			append(div3, div2);
			append(div2, t13);
			append(div2, t14);
			append(div3, t15);
			if (if_block0) if_block0.m(div3, null);
			append(div11, t16);
			if (if_block1) if_block1.m(div11, null);
			append(div11, t17);
			append(div11, div4);
			if_block2.m(div4, null);
			append(div11, t18);
			if (if_block3) if_block3.m(div11, null);
			append(div11, t19);
			append(div11, details1);
			append(details1, summary1);
			append(details1, t21);
			append(details1, div5);
			append(div5, label1);
			append(label1, input2);
			input2.checked = /*showRestricted*/ ctx[4];
			append(label1, t22);
			append(div5, t23);
			append(div5, label2);
			append(label2, input3);
			input3.checked = /*showDanger*/ ctx[5];
			append(label2, t24);
			append(div5, t25);
			append(div5, label3);
			append(label3, input4);
			input4.checked = /*showProtect*/ ctx[6];
			append(label3, t26);
			append(div5, t27);
			append(div5, label4);
			append(label4, input5);
			input5.checked = /*showProhibited*/ ctx[17];
			append(label4, t28);
			append(div5, t29);
			append(div5, label5);
			append(label5, input6);
			input6.checked = /*showTemporary*/ ctx[18];
			append(label5, t30);
			append(div11, t31);
			append(div11, details2);
			append(details2, summary2);
			append(details2, t33);
			append(details2, div6);
			append(div6, label6);
			append(label6, input7);
			input7.checked = /*showCtr*/ ctx[7];
			append(label6, t34);
			append(div6, t35);
			append(div6, label7);
			append(label7, input8);
			input8.checked = /*showCtaUta*/ ctx[8];
			append(label7, t36);
			append(div11, t37);
			append(div11, details3);
			append(details3, summary3);
			append(details3, t39);
			append(details3, div7);
			append(div7, label8);
			append(label8, input9);
			input9.checked = /*showRmz*/ ctx[9];
			append(label8, t40);
			append(div7, t41);
			append(div7, label9);
			append(label9, input10);
			input10.checked = /*showTmz*/ ctx[10];
			append(label9, t42);
			append(div7, t43);
			append(div7, label10);
			append(label10, input11);
			input11.checked = /*showAtz*/ ctx[11];
			append(label10, t44);
			append(div7, t45);
			append(div7, label11);
			append(label11, input12);
			input12.checked = /*showNavRadio*/ ctx[19];
			append(label11, t46);
			append(div11, t47);
			append(div11, details4);
			append(details4, summary4);
			append(details4, t49);
			append(details4, div8);
			append(div8, label12);
			append(label12, input13);
			input13.checked = /*showFis*/ ctx[12];
			append(label12, t50);
			append(div8, t51);
			append(div8, label13);
			append(label13, input14);
			input14.checked = /*showSectors*/ ctx[13];
			append(label13, t52);
			append(div8, t53);
			append(div8, label14);
			append(label14, input15);
			input15.checked = /*showGlider*/ ctx[14];
			append(label14, t54);
			append(div8, t55);
			append(div8, label15);
			append(label15, input16);
			input16.checked = /*showUav*/ ctx[15];
			append(label15, t56);
			append(div8, t57);
			append(div8, label16);
			append(label16, input17);
			input17.checked = /*showMilitary*/ ctx[20];
			append(label16, t58);
			append(div11, t59);
			append(div11, details5);
			append(details5, summary5);
			append(details5, t61);
			append(details5, div9);
			append(div9, label17);
			append(label17, input18);
			input18.checked = /*showOther*/ ctx[16];
			append(label17, t62);
			append(div11, t63);
			append(div11, details6);
			append(details6, summary6);
			append(details6, t65);
			append(details6, div10);
			append(div10, label18);
			append(label18, input19);
			input19.checked = /*showMilitaryAll*/ ctx[24];
			append(label18, t66);
			append(div10, t67);
			append(div10, label19);
			append(label19, input20);
			input20.checked = /*showSpecialZones*/ ctx[21];
			append(label19, t68);
			append(div10, t69);
			append(div10, label20);
			append(label20, input21);
			input21.checked = /*showInfoAreas*/ ctx[22];
			append(label20, t70);
			append(div10, t71);
			append(div10, label21);
			append(label21, input22);
			input22.checked = /*showSportUas*/ ctx[23];
			append(label21, t72);

			if (!mounted) {
				dispose = [
					listen(input0, "input", /*input0_input_handler*/ ctx[38]),
					listen(input0, "input", /*input_handler*/ ctx[39]),
					listen(input0, "click", click_handler),
					listen(input0, "mousedown", mousedown_handler),
					listen(input0, "keydown", keydown_handler),
					listen(input0, "keypress", keypress_handler),
					listen(input0, "keyup", keyup_handler),
					listen(input1, "change", /*input1_change_handler*/ ctx[40]),
					listen(input1, "change", /*handleFavoritesChange*/ ctx[29]),
					listen(input2, "change", /*input2_change_handler*/ ctx[48]),
					listen(input2, "change", /*handleToggleChange*/ ctx[28]),
					listen(input3, "change", /*input3_change_handler*/ ctx[49]),
					listen(input3, "change", /*handleToggleChange*/ ctx[28]),
					listen(input4, "change", /*input4_change_handler*/ ctx[50]),
					listen(input4, "change", /*handleToggleChange*/ ctx[28]),
					listen(input5, "change", /*input5_change_handler*/ ctx[51]),
					listen(input5, "change", /*handleToggleChange*/ ctx[28]),
					listen(input6, "change", /*input6_change_handler*/ ctx[52]),
					listen(input6, "change", /*handleToggleChange*/ ctx[28]),
					listen(input7, "change", /*input7_change_handler*/ ctx[53]),
					listen(input7, "change", /*handleToggleChange*/ ctx[28]),
					listen(input8, "change", /*input8_change_handler*/ ctx[54]),
					listen(input8, "change", /*handleToggleChange*/ ctx[28]),
					listen(input9, "change", /*input9_change_handler*/ ctx[55]),
					listen(input9, "change", /*handleToggleChange*/ ctx[28]),
					listen(input10, "change", /*input10_change_handler*/ ctx[56]),
					listen(input10, "change", /*handleToggleChange*/ ctx[28]),
					listen(input11, "change", /*input11_change_handler*/ ctx[57]),
					listen(input11, "change", /*handleToggleChange*/ ctx[28]),
					listen(input12, "change", /*input12_change_handler*/ ctx[58]),
					listen(input12, "change", /*handleToggleChange*/ ctx[28]),
					listen(input13, "change", /*input13_change_handler*/ ctx[59]),
					listen(input13, "change", /*handleToggleChange*/ ctx[28]),
					listen(input14, "change", /*input14_change_handler*/ ctx[60]),
					listen(input14, "change", /*handleToggleChange*/ ctx[28]),
					listen(input15, "change", /*input15_change_handler*/ ctx[61]),
					listen(input15, "change", /*handleToggleChange*/ ctx[28]),
					listen(input16, "change", /*input16_change_handler*/ ctx[62]),
					listen(input16, "change", /*handleToggleChange*/ ctx[28]),
					listen(input17, "change", /*input17_change_handler*/ ctx[63]),
					listen(input17, "change", /*handleToggleChange*/ ctx[28]),
					listen(input18, "change", /*input18_change_handler*/ ctx[64]),
					listen(input18, "change", /*handleToggleChange*/ ctx[28]),
					listen(input19, "change", /*input19_change_handler*/ ctx[65]),
					listen(input19, "change", /*handleToggleChange*/ ctx[28]),
					listen(input20, "change", /*input20_change_handler*/ ctx[66]),
					listen(input20, "change", /*handleToggleChange*/ ctx[28]),
					listen(input21, "change", /*input21_change_handler*/ ctx[67]),
					listen(input21, "change", /*handleToggleChange*/ ctx[28]),
					listen(input22, "change", /*input22_change_handler*/ ctx[68]),
					listen(input22, "change", /*handleToggleChange*/ ctx[28])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*searchText*/ 4 && input0.value !== /*searchText*/ ctx[2]) {
				set_input_value(input0, /*searchText*/ ctx[2]);
			}

			if (dirty[0] & /*showFavoritesOnly*/ 33554432) {
				input1.checked = /*showFavoritesOnly*/ ctx[25];
			}

			if (dirty[0] & /*favoriteCount*/ 67108864) set_data(t14, /*favoriteCount*/ ctx[26]);

			if (/*favoriteCount*/ ctx[26] > 0) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					if_block0.m(div3, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*searchResults*/ ctx[3].length > 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_2(ctx);
					if_block1.c();
					if_block1.m(div11, t17);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block2) {
				if_block2.p(ctx, dirty);
			} else {
				if_block2.d(1);
				if_block2 = current_block_type(ctx);

				if (if_block2) {
					if_block2.c();
					if_block2.m(div4, null);
				}
			}

			if (/*selectedFeature*/ ctx[1]) {
				if (if_block3) {
					if_block3.p(ctx, dirty);
				} else {
					if_block3 = create_if_block(ctx);
					if_block3.c();
					if_block3.m(div11, t19);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}

			if (dirty[0] & /*showRestricted*/ 16) {
				input2.checked = /*showRestricted*/ ctx[4];
			}

			if (dirty[0] & /*showDanger*/ 32) {
				input3.checked = /*showDanger*/ ctx[5];
			}

			if (dirty[0] & /*showProtect*/ 64) {
				input4.checked = /*showProtect*/ ctx[6];
			}

			if (dirty[0] & /*showProhibited*/ 131072) {
				input5.checked = /*showProhibited*/ ctx[17];
			}

			if (dirty[0] & /*showTemporary*/ 262144) {
				input6.checked = /*showTemporary*/ ctx[18];
			}

			if (dirty[0] & /*showCtr*/ 128) {
				input7.checked = /*showCtr*/ ctx[7];
			}

			if (dirty[0] & /*showCtaUta*/ 256) {
				input8.checked = /*showCtaUta*/ ctx[8];
			}

			if (dirty[0] & /*showRmz*/ 512) {
				input9.checked = /*showRmz*/ ctx[9];
			}

			if (dirty[0] & /*showTmz*/ 1024) {
				input10.checked = /*showTmz*/ ctx[10];
			}

			if (dirty[0] & /*showAtz*/ 2048) {
				input11.checked = /*showAtz*/ ctx[11];
			}

			if (dirty[0] & /*showNavRadio*/ 524288) {
				input12.checked = /*showNavRadio*/ ctx[19];
			}

			if (dirty[0] & /*showFis*/ 4096) {
				input13.checked = /*showFis*/ ctx[12];
			}

			if (dirty[0] & /*showSectors*/ 8192) {
				input14.checked = /*showSectors*/ ctx[13];
			}

			if (dirty[0] & /*showGlider*/ 16384) {
				input15.checked = /*showGlider*/ ctx[14];
			}

			if (dirty[0] & /*showUav*/ 32768) {
				input16.checked = /*showUav*/ ctx[15];
			}

			if (dirty[0] & /*showMilitary*/ 1048576) {
				input17.checked = /*showMilitary*/ ctx[20];
			}

			if (dirty[0] & /*showOther*/ 65536) {
				input18.checked = /*showOther*/ ctx[16];
			}

			if (dirty[0] & /*showMilitaryAll*/ 16777216) {
				input19.checked = /*showMilitaryAll*/ ctx[24];
			}

			if (dirty[0] & /*showSpecialZones*/ 2097152) {
				input20.checked = /*showSpecialZones*/ ctx[21];
			}

			if (dirty[0] & /*showInfoAreas*/ 4194304) {
				input21.checked = /*showInfoAreas*/ ctx[22];
			}

			if (dirty[0] & /*showSportUas*/ 8388608) {
				input22.checked = /*showSportUas*/ ctx[23];
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div11);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if_block2.d();
			if (if_block3) if_block3.d();
			mounted = false;
			run_all(dispose);
		}
	};
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
	const fid = feature?.id ?? p.id ?? p.uuid ?? p.gml_id ?? p.identifier;
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

function instance($$self, $$props, $$invalidate) {
	let currentFavorites;
	const L = window.L;
	let allData = window.__dfsAirspacesAllData || null;
	let layers = window.__dfsAirspacesLayers || {};
	let highlightLayer = window.__dfsAirspacesHighlight || null;
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

			$$invalidate(4, showRestricted = activeGroups.has("restricted"));
			$$invalidate(5, showDanger = activeGroups.has("danger"));
			$$invalidate(6, showProtect = activeGroups.has("protect"));
			$$invalidate(7, showCtr = activeGroups.has("ctr"));
			$$invalidate(8, showCtaUta = activeGroups.has("cta_uta"));
			$$invalidate(9, showRmz = activeGroups.has("rmz"));
			$$invalidate(10, showTmz = activeGroups.has("tmz"));
			$$invalidate(11, showAtz = activeGroups.has("atz"));
			$$invalidate(12, showFis = activeGroups.has("fis"));
			$$invalidate(13, showSectors = activeGroups.has("sectors"));
			$$invalidate(14, showGlider = activeGroups.has("glider"));
			$$invalidate(15, showUav = activeGroups.has("uav"));
			$$invalidate(17, showProhibited = activeGroups.has("prohibited"));
			$$invalidate(18, showTemporary = activeGroups.has("temporary"));
			$$invalidate(19, showNavRadio = activeGroups.has("nav_radio"));
			$$invalidate(20, showMilitary = activeGroups.has("military"));
			$$invalidate(16, showOther = activeGroups.has("other"));
			$$invalidate(21, showSpecialZones = false);
			$$invalidate(22, showInfoAreas = false);
			$$invalidate(23, showSportUas = false);
			$$invalidate(24, showMilitaryAll = false);
		}

		handleToggleChange();
		updateSearch();
	}

	let favoriteIds = [];
	let favoriteIdSet = new Set();
	let isToggling = false;

	function setFavoriteIds(ids) {
		$$invalidate(37, favoriteIds = [...new Set(ids.map(String))]);
		favoriteIdSet = new Set(favoriteIds);
		$$invalidate(26, favoriteCount = favoriteIds.length);
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
			$$invalidate(0, foundAirspaces = foundAirspaces.filter(f => isFeatureVisibleByFilters(f)));

			if (selectedFeature && !isFeatureVisibleByFilters(selectedFeature)) {
				$$invalidate(1, selectedFeature = null);
				removeHighlight();
			} else if (selectedFeature) {
				$$invalidate(1, selectedFeature = { ...selectedFeature });
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
			$$invalidate(3, searchResults = []);
			return;
		}

		$$invalidate(3, searchResults = allData.features.filter(feature => {
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
					if (group === "restricted") $$invalidate(4, showRestricted = true);
					if (group === "danger") $$invalidate(5, showDanger = true);
					if (group === "protect") $$invalidate(6, showProtect = true);
					if (group === "ctr") $$invalidate(7, showCtr = true);
					if (group === "cta_uta") $$invalidate(8, showCtaUta = true);
					if (group === "rmz") $$invalidate(9, showRmz = true);
					if (group === "tmz") $$invalidate(10, showTmz = true);
					if (group === "atz") $$invalidate(11, showAtz = true);
					if (group === "fis") $$invalidate(12, showFis = true);
					if (group === "sectors") $$invalidate(13, showSectors = true);
					if (group === "glider") $$invalidate(14, showGlider = true);
					if (group === "uav") $$invalidate(15, showUav = true);
					if (group === "prohibited") $$invalidate(17, showProhibited = true);
					if (group === "temporary") $$invalidate(18, showTemporary = true);
					if (group === "nav_radio") $$invalidate(19, showNavRadio = true);
					if (group === "military") $$invalidate(20, showMilitary = true);
					if (group === "other") $$invalidate(16, showOther = true);
				}
			}

			saveUIState();
		}
	}

	function highlightFeature(feature) {
		removeHighlight();
		ensureGroupIsVisible(feature);
		$$invalidate(1, selectedFeature = feature);

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
		$$invalidate(0, foundAirspaces = allData.features.filter(feature => isFeatureVisibleByFilters(feature) && featureContainsPoint(feature, lon, lat)));
		$$invalidate(1, selectedFeature = null);
		removeHighlight();
	}

	function handleMapContextMenu(e) {
		if (!allData) return;
		if (e?.originalEvent?.preventDefault) e.originalEvent.preventDefault();
		const lat = e.latlng.lat;
		const lon = e.latlng.lng;
		$$invalidate(0, foundAirspaces = allData.features.filter(feature => isFeatureVisibleByFilters(feature) && featureContainsPoint(feature, lon, lat)));

		if (foundAirspaces.length > 0) {
			$$invalidate(1, selectedFeature = foundAirspaces[0]);
			highlightFeature(selectedFeature);
			openInfoPopup(lat, lon, selectedFeature);
		} else {
			$$invalidate(1, selectedFeature = null);
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
			$$invalidate(1, selectedFeature = null);
			removeHighlight();
		}
	}

	let isRuntimeActive = false;
	let hasDataLoaded = !!allData;
	let infoPopup = null;

	function ensureRuntimeAttached() {
		if (!isRuntimeActive) {
			map.on("click", handleMapClick);
			map.on("contextmenu", handleMapContextMenu);
			isRuntimeActive = true;
		}
	}

	function destroyRuntime() {
		if (isRuntimeActive) {
			map.off("click", handleMapClick);
			map.off("contextmenu", handleMapContextMenu);
			isRuntimeActive = false;
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
			const response = await fetch("https://raw.githubusercontent.com/Fledervie/dfs-airspace-data/main/edr_from_aixm.geojson");

			if (!response.ok) {
				alert("Load error: " + response.status);
				return;
			}

			$$invalidate(36, allData = await response.json());
			window.__dfsAirspacesAllData = allData;
			layers.restricted = makeLayer("restricted", "#000000", 0.10);
			layers.danger = makeLayer("danger", "#000000", 0.08);
			layers.protect = makeLayer("protect", "#000000", 0.08);
			layers.ctr = makeLayer("ctr", "#000000", 0.06);
			layers.cta_uta = makeLayer("cta_uta", "#000000", 0.04);
			layers.rmz = makeLayer("rmz", "#000000", 0.05);
			layers.tmz = makeLayer("tmz", "#000000", 0.05);
			layers.atz = makeLayer("atz", "#000000", 0.06);
			layers.fis = makeLayer("fis", "#000000", 0.03);
			layers.sectors = makeLayer("sectors", "#000000", 0.03);
			layers.glider = makeLayer("glider", "#000000", 0.05);
			layers.uav = makeLayer("uav", "#000000", 0.05);
			layers.prohibited = makeLayer("prohibited", "#8b0000", 0.07);
			layers.temporary = makeLayer("temporary", "#ff8c00", 0.05);
			layers.nav_radio = makeLayer("nav_radio", "#1e90ff", 0.05);
			layers.military = makeLayer("military", "#556b2f", 0.05);
			layers.other = makeLayer("other", "#555555", 0.02);
			window.__dfsAirspacesLayers = layers;
			hasDataLoaded = true;
		}

		ensureRuntimeAttached();
		updateLayers();
		const bounds = layers.restricted?.getBounds?.();
		if (bounds && bounds.isValid()) map.fitBounds(bounds);
		window.addEventListener("beforeunload", destroyRuntime);
	});

	onDestroy(() => {
		
	});

	function selectFeature(feature, e) {
		e?.preventDefault();
		e?.stopPropagation();
		$$invalidate(1, selectedFeature = feature);
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
		$$invalidate(2, searchText);
	}

	const input_handler = e => {
		e.stopPropagation();
		updateSearch();
	};

	function input1_change_handler() {
		showFavoritesOnly = this.checked;
		$$invalidate(25, showFavoritesOnly);
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
		$$invalidate(4, showRestricted);
	}

	function input3_change_handler() {
		showDanger = this.checked;
		$$invalidate(5, showDanger);
	}

	function input4_change_handler() {
		showProtect = this.checked;
		$$invalidate(6, showProtect);
	}

	function input5_change_handler() {
		showProhibited = this.checked;
		$$invalidate(17, showProhibited);
	}

	function input6_change_handler() {
		showTemporary = this.checked;
		$$invalidate(18, showTemporary);
	}

	function input7_change_handler() {
		showCtr = this.checked;
		$$invalidate(7, showCtr);
	}

	function input8_change_handler() {
		showCtaUta = this.checked;
		$$invalidate(8, showCtaUta);
	}

	function input9_change_handler() {
		showRmz = this.checked;
		$$invalidate(9, showRmz);
	}

	function input10_change_handler() {
		showTmz = this.checked;
		$$invalidate(10, showTmz);
	}

	function input11_change_handler() {
		showAtz = this.checked;
		$$invalidate(11, showAtz);
	}

	function input12_change_handler() {
		showNavRadio = this.checked;
		$$invalidate(19, showNavRadio);
	}

	function input13_change_handler() {
		showFis = this.checked;
		$$invalidate(12, showFis);
	}

	function input14_change_handler() {
		showSectors = this.checked;
		$$invalidate(13, showSectors);
	}

	function input15_change_handler() {
		showGlider = this.checked;
		$$invalidate(14, showGlider);
	}

	function input16_change_handler() {
		showUav = this.checked;
		$$invalidate(15, showUav);
	}

	function input17_change_handler() {
		showMilitary = this.checked;
		$$invalidate(20, showMilitary);
	}

	function input18_change_handler() {
		showOther = this.checked;
		$$invalidate(16, showOther);
	}

	function input19_change_handler() {
		showMilitaryAll = this.checked;
		$$invalidate(24, showMilitaryAll);
	}

	function input20_change_handler() {
		showSpecialZones = this.checked;
		$$invalidate(21, showSpecialZones);
	}

	function input21_change_handler() {
		showInfoAreas = this.checked;
		$$invalidate(22, showInfoAreas);
	}

	function input22_change_handler() {
		showSportUas = this.checked;
		$$invalidate(23, showSportUas);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[1] & /*allData, favoriteIds*/ 96) {
			$$invalidate(27, currentFavorites = allData ? favoriteFeatures(favoriteIds) : []);
		}
	};

	return [
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
		favoriteCount,
		currentFavorites,
		handleToggleChange,
		handleFavoritesChange,
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
		input22_change_handler
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
