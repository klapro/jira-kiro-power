#!/usr/bin/env node
import ja from "node:process";
var de;
(function(n) {
  n.assertEqual = (r) => r;
  function e(r) {
  }
  n.assertIs = e;
  function t(r) {
    throw new Error();
  }
  n.assertNever = t, n.arrayToEnum = (r) => {
    const s = {};
    for (const l of r)
      s[l] = l;
    return s;
  }, n.getValidEnumValues = (r) => {
    const s = n.objectKeys(r).filter((i) => typeof r[r[i]] != "number"), l = {};
    for (const i of s)
      l[i] = r[i];
    return n.objectValues(l);
  }, n.objectValues = (r) => n.objectKeys(r).map(function(s) {
    return r[s];
  }), n.objectKeys = typeof Object.keys == "function" ? (r) => Object.keys(r) : (r) => {
    const s = [];
    for (const l in r)
      Object.prototype.hasOwnProperty.call(r, l) && s.push(l);
    return s;
  }, n.find = (r, s) => {
    for (const l of r)
      if (s(l))
        return l;
  }, n.isInteger = typeof Number.isInteger == "function" ? (r) => Number.isInteger(r) : (r) => typeof r == "number" && isFinite(r) && Math.floor(r) === r;
  function a(r, s = " | ") {
    return r.map((l) => typeof l == "string" ? `'${l}'` : l).join(s);
  }
  n.joinValues = a, n.jsonStringifyReplacer = (r, s) => typeof s == "bigint" ? s.toString() : s;
})(de || (de = {}));
var sa;
(function(n) {
  n.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(sa || (sa = {}));
const V = de.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), sr = (n) => {
  switch (typeof n) {
    case "undefined":
      return V.undefined;
    case "string":
      return V.string;
    case "number":
      return isNaN(n) ? V.nan : V.number;
    case "boolean":
      return V.boolean;
    case "function":
      return V.function;
    case "bigint":
      return V.bigint;
    case "symbol":
      return V.symbol;
    case "object":
      return Array.isArray(n) ? V.array : n === null ? V.null : n.then && typeof n.then == "function" && n.catch && typeof n.catch == "function" ? V.promise : typeof Map < "u" && n instanceof Map ? V.map : typeof Set < "u" && n instanceof Set ? V.set : typeof Date < "u" && n instanceof Date ? V.date : V.object;
    default:
      return V.unknown;
  }
}, q = de.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]), Tn = (n) => JSON.stringify(n, null, 2).replace(/"([^"]+)":/g, "$1:");
class qe extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (a) => {
      this.issues = [...this.issues, a];
    }, this.addIssues = (a = []) => {
      this.issues = [...this.issues, ...a];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(s) {
      return s.message;
    }, a = { _errors: [] }, r = (s) => {
      for (const l of s.issues)
        if (l.code === "invalid_union")
          l.unionErrors.map(r);
        else if (l.code === "invalid_return_type")
          r(l.returnTypeError);
        else if (l.code === "invalid_arguments")
          r(l.argumentsError);
        else if (l.path.length === 0)
          a._errors.push(t(l));
        else {
          let i = a, u = 0;
          for (; u < l.path.length; ) {
            const f = l.path[u];
            u === l.path.length - 1 ? (i[f] = i[f] || { _errors: [] }, i[f]._errors.push(t(l))) : i[f] = i[f] || { _errors: [] }, i = i[f], u++;
          }
        }
    };
    return r(this), a;
  }
  static assert(e) {
    if (!(e instanceof qe))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, de.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, a = [];
    for (const r of this.issues)
      r.path.length > 0 ? (t[r.path[0]] = t[r.path[0]] || [], t[r.path[0]].push(e(r))) : a.push(e(r));
    return { formErrors: a, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
qe.create = (n) => new qe(n);
const Er = (n, e) => {
  let t;
  switch (n.code) {
    case q.invalid_type:
      n.received === V.undefined ? t = "Required" : t = `Expected ${n.expected}, received ${n.received}`;
      break;
    case q.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(n.expected, de.jsonStringifyReplacer)}`;
      break;
    case q.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${de.joinValues(n.keys, ", ")}`;
      break;
    case q.invalid_union:
      t = "Invalid input";
      break;
    case q.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${de.joinValues(n.options)}`;
      break;
    case q.invalid_enum_value:
      t = `Invalid enum value. Expected ${de.joinValues(n.options)}, received '${n.received}'`;
      break;
    case q.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case q.invalid_return_type:
      t = "Invalid function return type";
      break;
    case q.invalid_date:
      t = "Invalid date";
      break;
    case q.invalid_string:
      typeof n.validation == "object" ? "includes" in n.validation ? (t = `Invalid input: must include "${n.validation.includes}"`, typeof n.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${n.validation.position}`)) : "startsWith" in n.validation ? t = `Invalid input: must start with "${n.validation.startsWith}"` : "endsWith" in n.validation ? t = `Invalid input: must end with "${n.validation.endsWith}"` : de.assertNever(n.validation) : n.validation !== "regex" ? t = `Invalid ${n.validation}` : t = "Invalid";
      break;
    case q.too_small:
      n.type === "array" ? t = `Array must contain ${n.exact ? "exactly" : n.inclusive ? "at least" : "more than"} ${n.minimum} element(s)` : n.type === "string" ? t = `String must contain ${n.exact ? "exactly" : n.inclusive ? "at least" : "over"} ${n.minimum} character(s)` : n.type === "number" ? t = `Number must be ${n.exact ? "exactly equal to " : n.inclusive ? "greater than or equal to " : "greater than "}${n.minimum}` : n.type === "date" ? t = `Date must be ${n.exact ? "exactly equal to " : n.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(n.minimum))}` : t = "Invalid input";
      break;
    case q.too_big:
      n.type === "array" ? t = `Array must contain ${n.exact ? "exactly" : n.inclusive ? "at most" : "less than"} ${n.maximum} element(s)` : n.type === "string" ? t = `String must contain ${n.exact ? "exactly" : n.inclusive ? "at most" : "under"} ${n.maximum} character(s)` : n.type === "number" ? t = `Number must be ${n.exact ? "exactly" : n.inclusive ? "less than or equal to" : "less than"} ${n.maximum}` : n.type === "bigint" ? t = `BigInt must be ${n.exact ? "exactly" : n.inclusive ? "less than or equal to" : "less than"} ${n.maximum}` : n.type === "date" ? t = `Date must be ${n.exact ? "exactly" : n.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(n.maximum))}` : t = "Invalid input";
      break;
    case q.custom:
      t = "Invalid input";
      break;
    case q.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case q.not_multiple_of:
      t = `Number must be a multiple of ${n.multipleOf}`;
      break;
    case q.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, de.assertNever(n);
  }
  return { message: t };
};
let js = Er;
function An(n) {
  js = n;
}
function Xr() {
  return js;
}
const et = (n) => {
  const { data: e, path: t, errorMaps: a, issueData: r } = n, s = [...t, ...r.path || []], l = {
    ...r,
    path: s
  };
  if (r.message !== void 0)
    return {
      ...r,
      path: s,
      message: r.message
    };
  let i = "";
  const u = a.filter((f) => !!f).slice().reverse();
  for (const f of u)
    i = f(l, { data: e, defaultError: i }).message;
  return {
    ...r,
    path: s,
    message: i
  };
}, kn = [];
function z(n, e) {
  const t = Xr(), a = et({
    issueData: e,
    data: n.data,
    path: n.path,
    errorMaps: [
      n.common.contextualErrorMap,
      // contextual error map is first priority
      n.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === Er ? void 0 : Er
      // then global default map
    ].filter((r) => !!r)
  });
  n.common.issues.push(a);
}
class ke {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const a = [];
    for (const r of t) {
      if (r.status === "aborted")
        return G;
      r.status === "dirty" && e.dirty(), a.push(r.value);
    }
    return { status: e.value, value: a };
  }
  static async mergeObjectAsync(e, t) {
    const a = [];
    for (const r of t) {
      const s = await r.key, l = await r.value;
      a.push({
        key: s,
        value: l
      });
    }
    return ke.mergeObjectSync(e, a);
  }
  static mergeObjectSync(e, t) {
    const a = {};
    for (const r of t) {
      const { key: s, value: l } = r;
      if (s.status === "aborted" || l.status === "aborted")
        return G;
      s.status === "dirty" && e.dirty(), l.status === "dirty" && e.dirty(), s.value !== "__proto__" && (typeof l.value < "u" || r.alwaysSet) && (a[s.value] = l.value);
    }
    return { status: e.value, value: a };
  }
}
const G = Object.freeze({
  status: "aborted"
}), br = (n) => ({ status: "dirty", value: n }), De = (n) => ({ status: "valid", value: n }), na = (n) => n.status === "aborted", ia = (n) => n.status === "dirty", pr = (n) => n.status === "valid", Cr = (n) => typeof Promise < "u" && n instanceof Promise;
function rt(n, e, t, a) {
  if (typeof e == "function" ? n !== e || !0 : !e.has(n)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(n);
}
function Ds(n, e, t, a, r) {
  if (typeof e == "function" ? n !== e || !0 : !e.has(n)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e.set(n, t), t;
}
var H;
(function(n) {
  n.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, n.toString = (e) => typeof e == "string" ? e : e?.message;
})(H || (H = {}));
var Tr, Ar;
class Ye {
  constructor(e, t, a, r) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = a, this._key = r;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Da = (n, e) => {
  if (pr(e))
    return { success: !0, data: e.value };
  if (!n.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new qe(n.common.issues);
      return this._error = t, this._error;
    }
  };
};
function ae(n) {
  if (!n)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: a, description: r } = n;
  if (e && (t || a))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: r } : { errorMap: (l, i) => {
    var u, f;
    const { message: p } = n;
    return l.code === "invalid_enum_value" ? { message: p ?? i.defaultError } : typeof i.data > "u" ? { message: (u = p ?? a) !== null && u !== void 0 ? u : i.defaultError } : l.code !== "invalid_type" ? { message: i.defaultError } : { message: (f = p ?? t) !== null && f !== void 0 ? f : i.defaultError };
  }, description: r };
}
class ne {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return sr(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: sr(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new ke(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: sr(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (Cr(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const a = this.safeParse(e, t);
    if (a.success)
      return a.data;
    throw a.error;
  }
  safeParse(e, t) {
    var a;
    const r = {
      common: {
        issues: [],
        async: (a = t?.async) !== null && a !== void 0 ? a : !1,
        contextualErrorMap: t?.errorMap
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: sr(e)
    }, s = this._parseSync({ data: e, path: r.path, parent: r });
    return Da(r, s);
  }
  "~validate"(e) {
    var t, a;
    const r = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: sr(e)
    };
    if (!this["~standard"].async)
      try {
        const s = this._parseSync({ data: e, path: [], parent: r });
        return pr(s) ? {
          value: s.value
        } : {
          issues: r.common.issues
        };
      } catch (s) {
        !((a = (t = s?.message) === null || t === void 0 ? void 0 : t.toLowerCase()) === null || a === void 0) && a.includes("encountered") && (this["~standard"].async = !0), r.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: r }).then((s) => pr(s) ? {
      value: s.value
    } : {
      issues: r.common.issues
    });
  }
  async parseAsync(e, t) {
    const a = await this.safeParseAsync(e, t);
    if (a.success)
      return a.data;
    throw a.error;
  }
  async safeParseAsync(e, t) {
    const a = {
      common: {
        issues: [],
        contextualErrorMap: t?.errorMap,
        async: !0
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: sr(e)
    }, r = this._parse({ data: e, path: a.path, parent: a }), s = await (Cr(r) ? r : Promise.resolve(r));
    return Da(a, s);
  }
  refine(e, t) {
    const a = (r) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(r) : t;
    return this._refinement((r, s) => {
      const l = e(r), i = () => s.addIssue({
        code: q.custom,
        ...a(r)
      });
      return typeof Promise < "u" && l instanceof Promise ? l.then((u) => u ? !0 : (i(), !1)) : l ? !0 : (i(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((a, r) => e(a) ? !0 : (r.addIssue(typeof t == "function" ? t(a, r) : t), !1));
  }
  _refinement(e) {
    return new Je({
      schema: this,
      typeName: W.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (t) => this["~validate"](t)
    };
  }
  optional() {
    return Ge.create(this, this._def);
  }
  nullable() {
    return cr.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return He.create(this);
  }
  promise() {
    return wr.create(this, this._def);
  }
  or(e) {
    return Fr.create([this, e], this._def);
  }
  and(e) {
    return qr.create(this, e, this._def);
  }
  transform(e) {
    return new Je({
      ...ae(this._def),
      schema: this,
      typeName: W.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Zr({
      ...ae(this._def),
      innerType: this,
      defaultValue: t,
      typeName: W.ZodDefault
    });
  }
  brand() {
    return new da({
      typeName: W.ZodBranded,
      type: this,
      ...ae(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Vr({
      ...ae(this._def),
      innerType: this,
      catchValue: t,
      typeName: W.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return Jr.create(this, e);
  }
  readonly() {
    return Hr.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Cn = /^c[^\s-]{8,}$/i, jn = /^[0-9a-z]+$/, Dn = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Nn = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Fn = /^[a-z0-9_-]{21}$/i, qn = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Ln = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Mn = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Un = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let pt;
const zn = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Zn = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Vn = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Hn = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Jn = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Bn = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Ns = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Kn = new RegExp(`^${Ns}$`);
function Fs(n) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return n.precision ? e = `${e}\\.\\d{${n.precision}}` : n.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function Qn(n) {
  return new RegExp(`^${Fs(n)}$`);
}
function qs(n) {
  let e = `${Ns}T${Fs(n)}`;
  const t = [];
  return t.push(n.local ? "Z?" : "Z"), n.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Wn(n, e) {
  return !!((e === "v4" || !e) && zn.test(n) || (e === "v6" || !e) && Vn.test(n));
}
function Gn(n, e) {
  if (!qn.test(n))
    return !1;
  try {
    const [t] = n.split("."), a = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), r = JSON.parse(atob(a));
    return !(typeof r != "object" || r === null || !r.typ || !r.alg || e && r.alg !== e);
  } catch {
    return !1;
  }
}
function Yn(n, e) {
  return !!((e === "v4" || !e) && Zn.test(n) || (e === "v6" || !e) && Hn.test(n));
}
class Ve extends ne {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== V.string) {
      const s = this._getOrReturnCtx(e);
      return z(s, {
        code: q.invalid_type,
        expected: V.string,
        received: s.parsedType
      }), G;
    }
    const a = new ke();
    let r;
    for (const s of this._def.checks)
      if (s.kind === "min")
        e.data.length < s.value && (r = this._getOrReturnCtx(e, r), z(r, {
          code: q.too_small,
          minimum: s.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: s.message
        }), a.dirty());
      else if (s.kind === "max")
        e.data.length > s.value && (r = this._getOrReturnCtx(e, r), z(r, {
          code: q.too_big,
          maximum: s.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: s.message
        }), a.dirty());
      else if (s.kind === "length") {
        const l = e.data.length > s.value, i = e.data.length < s.value;
        (l || i) && (r = this._getOrReturnCtx(e, r), l ? z(r, {
          code: q.too_big,
          maximum: s.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: s.message
        }) : i && z(r, {
          code: q.too_small,
          minimum: s.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: s.message
        }), a.dirty());
      } else if (s.kind === "email")
        Mn.test(e.data) || (r = this._getOrReturnCtx(e, r), z(r, {
          validation: "email",
          code: q.invalid_string,
          message: s.message
        }), a.dirty());
      else if (s.kind === "emoji")
        pt || (pt = new RegExp(Un, "u")), pt.test(e.data) || (r = this._getOrReturnCtx(e, r), z(r, {
          validation: "emoji",
          code: q.invalid_string,
          message: s.message
        }), a.dirty());
      else if (s.kind === "uuid")
        Nn.test(e.data) || (r = this._getOrReturnCtx(e, r), z(r, {
          validation: "uuid",
          code: q.invalid_string,
          message: s.message
        }), a.dirty());
      else if (s.kind === "nanoid")
        Fn.test(e.data) || (r = this._getOrReturnCtx(e, r), z(r, {
          validation: "nanoid",
          code: q.invalid_string,
          message: s.message
        }), a.dirty());
      else if (s.kind === "cuid")
        Cn.test(e.data) || (r = this._getOrReturnCtx(e, r), z(r, {
          validation: "cuid",
          code: q.invalid_string,
          message: s.message
        }), a.dirty());
      else if (s.kind === "cuid2")
        jn.test(e.data) || (r = this._getOrReturnCtx(e, r), z(r, {
          validation: "cuid2",
          code: q.invalid_string,
          message: s.message
        }), a.dirty());
      else if (s.kind === "ulid")
        Dn.test(e.data) || (r = this._getOrReturnCtx(e, r), z(r, {
          validation: "ulid",
          code: q.invalid_string,
          message: s.message
        }), a.dirty());
      else if (s.kind === "url")
        try {
          new URL(e.data);
        } catch {
          r = this._getOrReturnCtx(e, r), z(r, {
            validation: "url",
            code: q.invalid_string,
            message: s.message
          }), a.dirty();
        }
      else s.kind === "regex" ? (s.regex.lastIndex = 0, s.regex.test(e.data) || (r = this._getOrReturnCtx(e, r), z(r, {
        validation: "regex",
        code: q.invalid_string,
        message: s.message
      }), a.dirty())) : s.kind === "trim" ? e.data = e.data.trim() : s.kind === "includes" ? e.data.includes(s.value, s.position) || (r = this._getOrReturnCtx(e, r), z(r, {
        code: q.invalid_string,
        validation: { includes: s.value, position: s.position },
        message: s.message
      }), a.dirty()) : s.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : s.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : s.kind === "startsWith" ? e.data.startsWith(s.value) || (r = this._getOrReturnCtx(e, r), z(r, {
        code: q.invalid_string,
        validation: { startsWith: s.value },
        message: s.message
      }), a.dirty()) : s.kind === "endsWith" ? e.data.endsWith(s.value) || (r = this._getOrReturnCtx(e, r), z(r, {
        code: q.invalid_string,
        validation: { endsWith: s.value },
        message: s.message
      }), a.dirty()) : s.kind === "datetime" ? qs(s).test(e.data) || (r = this._getOrReturnCtx(e, r), z(r, {
        code: q.invalid_string,
        validation: "datetime",
        message: s.message
      }), a.dirty()) : s.kind === "date" ? Kn.test(e.data) || (r = this._getOrReturnCtx(e, r), z(r, {
        code: q.invalid_string,
        validation: "date",
        message: s.message
      }), a.dirty()) : s.kind === "time" ? Qn(s).test(e.data) || (r = this._getOrReturnCtx(e, r), z(r, {
        code: q.invalid_string,
        validation: "time",
        message: s.message
      }), a.dirty()) : s.kind === "duration" ? Ln.test(e.data) || (r = this._getOrReturnCtx(e, r), z(r, {
        validation: "duration",
        code: q.invalid_string,
        message: s.message
      }), a.dirty()) : s.kind === "ip" ? Wn(e.data, s.version) || (r = this._getOrReturnCtx(e, r), z(r, {
        validation: "ip",
        code: q.invalid_string,
        message: s.message
      }), a.dirty()) : s.kind === "jwt" ? Gn(e.data, s.alg) || (r = this._getOrReturnCtx(e, r), z(r, {
        validation: "jwt",
        code: q.invalid_string,
        message: s.message
      }), a.dirty()) : s.kind === "cidr" ? Yn(e.data, s.version) || (r = this._getOrReturnCtx(e, r), z(r, {
        validation: "cidr",
        code: q.invalid_string,
        message: s.message
      }), a.dirty()) : s.kind === "base64" ? Jn.test(e.data) || (r = this._getOrReturnCtx(e, r), z(r, {
        validation: "base64",
        code: q.invalid_string,
        message: s.message
      }), a.dirty()) : s.kind === "base64url" ? Bn.test(e.data) || (r = this._getOrReturnCtx(e, r), z(r, {
        validation: "base64url",
        code: q.invalid_string,
        message: s.message
      }), a.dirty()) : de.assertNever(s);
    return { status: a.value, value: e.data };
  }
  _regex(e, t, a) {
    return this.refinement((r) => e.test(r), {
      validation: t,
      code: q.invalid_string,
      ...H.errToObj(a)
    });
  }
  _addCheck(e) {
    return new Ve({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...H.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...H.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...H.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...H.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...H.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...H.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...H.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...H.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...H.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...H.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...H.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...H.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...H.errToObj(e) });
  }
  datetime(e) {
    var t, a;
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof e?.precision > "u" ? null : e?.precision,
      offset: (t = e?.offset) !== null && t !== void 0 ? t : !1,
      local: (a = e?.local) !== null && a !== void 0 ? a : !1,
      ...H.errToObj(e?.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof e?.precision > "u" ? null : e?.precision,
      ...H.errToObj(e?.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...H.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...H.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t?.position,
      ...H.errToObj(t?.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...H.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...H.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...H.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...H.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...H.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, H.errToObj(e));
  }
  trim() {
    return new Ve({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new Ve({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new Ve({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
Ve.create = (n) => {
  var e;
  return new Ve({
    checks: [],
    typeName: W.ZodString,
    coerce: (e = n?.coerce) !== null && e !== void 0 ? e : !1,
    ...ae(n)
  });
};
function Xn(n, e) {
  const t = (n.toString().split(".")[1] || "").length, a = (e.toString().split(".")[1] || "").length, r = t > a ? t : a, s = parseInt(n.toFixed(r).replace(".", "")), l = parseInt(e.toFixed(r).replace(".", ""));
  return s % l / Math.pow(10, r);
}
class or extends ne {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== V.number) {
      const s = this._getOrReturnCtx(e);
      return z(s, {
        code: q.invalid_type,
        expected: V.number,
        received: s.parsedType
      }), G;
    }
    let a;
    const r = new ke();
    for (const s of this._def.checks)
      s.kind === "int" ? de.isInteger(e.data) || (a = this._getOrReturnCtx(e, a), z(a, {
        code: q.invalid_type,
        expected: "integer",
        received: "float",
        message: s.message
      }), r.dirty()) : s.kind === "min" ? (s.inclusive ? e.data < s.value : e.data <= s.value) && (a = this._getOrReturnCtx(e, a), z(a, {
        code: q.too_small,
        minimum: s.value,
        type: "number",
        inclusive: s.inclusive,
        exact: !1,
        message: s.message
      }), r.dirty()) : s.kind === "max" ? (s.inclusive ? e.data > s.value : e.data >= s.value) && (a = this._getOrReturnCtx(e, a), z(a, {
        code: q.too_big,
        maximum: s.value,
        type: "number",
        inclusive: s.inclusive,
        exact: !1,
        message: s.message
      }), r.dirty()) : s.kind === "multipleOf" ? Xn(e.data, s.value) !== 0 && (a = this._getOrReturnCtx(e, a), z(a, {
        code: q.not_multiple_of,
        multipleOf: s.value,
        message: s.message
      }), r.dirty()) : s.kind === "finite" ? Number.isFinite(e.data) || (a = this._getOrReturnCtx(e, a), z(a, {
        code: q.not_finite,
        message: s.message
      }), r.dirty()) : de.assertNever(s);
    return { status: r.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, H.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, H.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, H.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, H.toString(t));
  }
  setLimit(e, t, a, r) {
    return new or({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: a,
          message: H.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new or({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: H.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: H.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: H.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: H.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: H.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: H.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: H.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: H.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: H.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && de.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const a of this._def.checks) {
      if (a.kind === "finite" || a.kind === "int" || a.kind === "multipleOf")
        return !0;
      a.kind === "min" ? (t === null || a.value > t) && (t = a.value) : a.kind === "max" && (e === null || a.value < e) && (e = a.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
or.create = (n) => new or({
  checks: [],
  typeName: W.ZodNumber,
  coerce: n?.coerce || !1,
  ...ae(n)
});
class lr extends ne {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== V.bigint)
      return this._getInvalidInput(e);
    let a;
    const r = new ke();
    for (const s of this._def.checks)
      s.kind === "min" ? (s.inclusive ? e.data < s.value : e.data <= s.value) && (a = this._getOrReturnCtx(e, a), z(a, {
        code: q.too_small,
        type: "bigint",
        minimum: s.value,
        inclusive: s.inclusive,
        message: s.message
      }), r.dirty()) : s.kind === "max" ? (s.inclusive ? e.data > s.value : e.data >= s.value) && (a = this._getOrReturnCtx(e, a), z(a, {
        code: q.too_big,
        type: "bigint",
        maximum: s.value,
        inclusive: s.inclusive,
        message: s.message
      }), r.dirty()) : s.kind === "multipleOf" ? e.data % s.value !== BigInt(0) && (a = this._getOrReturnCtx(e, a), z(a, {
        code: q.not_multiple_of,
        multipleOf: s.value,
        message: s.message
      }), r.dirty()) : de.assertNever(s);
    return { status: r.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return z(t, {
      code: q.invalid_type,
      expected: V.bigint,
      received: t.parsedType
    }), G;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, H.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, H.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, H.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, H.toString(t));
  }
  setLimit(e, t, a, r) {
    return new lr({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: a,
          message: H.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new lr({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: H.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: H.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: H.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: H.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: H.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
lr.create = (n) => {
  var e;
  return new lr({
    checks: [],
    typeName: W.ZodBigInt,
    coerce: (e = n?.coerce) !== null && e !== void 0 ? e : !1,
    ...ae(n)
  });
};
class jr extends ne {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== V.boolean) {
      const a = this._getOrReturnCtx(e);
      return z(a, {
        code: q.invalid_type,
        expected: V.boolean,
        received: a.parsedType
      }), G;
    }
    return De(e.data);
  }
}
jr.create = (n) => new jr({
  typeName: W.ZodBoolean,
  coerce: n?.coerce || !1,
  ...ae(n)
});
class mr extends ne {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== V.date) {
      const s = this._getOrReturnCtx(e);
      return z(s, {
        code: q.invalid_type,
        expected: V.date,
        received: s.parsedType
      }), G;
    }
    if (isNaN(e.data.getTime())) {
      const s = this._getOrReturnCtx(e);
      return z(s, {
        code: q.invalid_date
      }), G;
    }
    const a = new ke();
    let r;
    for (const s of this._def.checks)
      s.kind === "min" ? e.data.getTime() < s.value && (r = this._getOrReturnCtx(e, r), z(r, {
        code: q.too_small,
        message: s.message,
        inclusive: !0,
        exact: !1,
        minimum: s.value,
        type: "date"
      }), a.dirty()) : s.kind === "max" ? e.data.getTime() > s.value && (r = this._getOrReturnCtx(e, r), z(r, {
        code: q.too_big,
        message: s.message,
        inclusive: !0,
        exact: !1,
        maximum: s.value,
        type: "date"
      }), a.dirty()) : de.assertNever(s);
    return {
      status: a.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new mr({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: H.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: H.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
mr.create = (n) => new mr({
  checks: [],
  coerce: n?.coerce || !1,
  typeName: W.ZodDate,
  ...ae(n)
});
class tt extends ne {
  _parse(e) {
    if (this._getType(e) !== V.symbol) {
      const a = this._getOrReturnCtx(e);
      return z(a, {
        code: q.invalid_type,
        expected: V.symbol,
        received: a.parsedType
      }), G;
    }
    return De(e.data);
  }
}
tt.create = (n) => new tt({
  typeName: W.ZodSymbol,
  ...ae(n)
});
class Dr extends ne {
  _parse(e) {
    if (this._getType(e) !== V.undefined) {
      const a = this._getOrReturnCtx(e);
      return z(a, {
        code: q.invalid_type,
        expected: V.undefined,
        received: a.parsedType
      }), G;
    }
    return De(e.data);
  }
}
Dr.create = (n) => new Dr({
  typeName: W.ZodUndefined,
  ...ae(n)
});
class Nr extends ne {
  _parse(e) {
    if (this._getType(e) !== V.null) {
      const a = this._getOrReturnCtx(e);
      return z(a, {
        code: q.invalid_type,
        expected: V.null,
        received: a.parsedType
      }), G;
    }
    return De(e.data);
  }
}
Nr.create = (n) => new Nr({
  typeName: W.ZodNull,
  ...ae(n)
});
class Sr extends ne {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return De(e.data);
  }
}
Sr.create = (n) => new Sr({
  typeName: W.ZodAny,
  ...ae(n)
});
class hr extends ne {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return De(e.data);
  }
}
hr.create = (n) => new hr({
  typeName: W.ZodUnknown,
  ...ae(n)
});
class nr extends ne {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return z(t, {
      code: q.invalid_type,
      expected: V.never,
      received: t.parsedType
    }), G;
  }
}
nr.create = (n) => new nr({
  typeName: W.ZodNever,
  ...ae(n)
});
class at extends ne {
  _parse(e) {
    if (this._getType(e) !== V.undefined) {
      const a = this._getOrReturnCtx(e);
      return z(a, {
        code: q.invalid_type,
        expected: V.void,
        received: a.parsedType
      }), G;
    }
    return De(e.data);
  }
}
at.create = (n) => new at({
  typeName: W.ZodVoid,
  ...ae(n)
});
class He extends ne {
  _parse(e) {
    const { ctx: t, status: a } = this._processInputParams(e), r = this._def;
    if (t.parsedType !== V.array)
      return z(t, {
        code: q.invalid_type,
        expected: V.array,
        received: t.parsedType
      }), G;
    if (r.exactLength !== null) {
      const l = t.data.length > r.exactLength.value, i = t.data.length < r.exactLength.value;
      (l || i) && (z(t, {
        code: l ? q.too_big : q.too_small,
        minimum: i ? r.exactLength.value : void 0,
        maximum: l ? r.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: r.exactLength.message
      }), a.dirty());
    }
    if (r.minLength !== null && t.data.length < r.minLength.value && (z(t, {
      code: q.too_small,
      minimum: r.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.minLength.message
    }), a.dirty()), r.maxLength !== null && t.data.length > r.maxLength.value && (z(t, {
      code: q.too_big,
      maximum: r.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.maxLength.message
    }), a.dirty()), t.common.async)
      return Promise.all([...t.data].map((l, i) => r.type._parseAsync(new Ye(t, l, t.path, i)))).then((l) => ke.mergeArray(a, l));
    const s = [...t.data].map((l, i) => r.type._parseSync(new Ye(t, l, t.path, i)));
    return ke.mergeArray(a, s);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new He({
      ...this._def,
      minLength: { value: e, message: H.toString(t) }
    });
  }
  max(e, t) {
    return new He({
      ...this._def,
      maxLength: { value: e, message: H.toString(t) }
    });
  }
  length(e, t) {
    return new He({
      ...this._def,
      exactLength: { value: e, message: H.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
He.create = (n, e) => new He({
  type: n,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: W.ZodArray,
  ...ae(e)
});
function _r(n) {
  if (n instanceof be) {
    const e = {};
    for (const t in n.shape) {
      const a = n.shape[t];
      e[t] = Ge.create(_r(a));
    }
    return new be({
      ...n._def,
      shape: () => e
    });
  } else return n instanceof He ? new He({
    ...n._def,
    type: _r(n.element)
  }) : n instanceof Ge ? Ge.create(_r(n.unwrap())) : n instanceof cr ? cr.create(_r(n.unwrap())) : n instanceof Xe ? Xe.create(n.items.map((e) => _r(e))) : n;
}
class be extends ne {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = de.objectKeys(e);
    return this._cached = { shape: e, keys: t };
  }
  _parse(e) {
    if (this._getType(e) !== V.object) {
      const f = this._getOrReturnCtx(e);
      return z(f, {
        code: q.invalid_type,
        expected: V.object,
        received: f.parsedType
      }), G;
    }
    const { status: a, ctx: r } = this._processInputParams(e), { shape: s, keys: l } = this._getCached(), i = [];
    if (!(this._def.catchall instanceof nr && this._def.unknownKeys === "strip"))
      for (const f in r.data)
        l.includes(f) || i.push(f);
    const u = [];
    for (const f of l) {
      const p = s[f], m = r.data[f];
      u.push({
        key: { status: "valid", value: f },
        value: p._parse(new Ye(r, m, r.path, f)),
        alwaysSet: f in r.data
      });
    }
    if (this._def.catchall instanceof nr) {
      const f = this._def.unknownKeys;
      if (f === "passthrough")
        for (const p of i)
          u.push({
            key: { status: "valid", value: p },
            value: { status: "valid", value: r.data[p] }
          });
      else if (f === "strict")
        i.length > 0 && (z(r, {
          code: q.unrecognized_keys,
          keys: i
        }), a.dirty());
      else if (f !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const f = this._def.catchall;
      for (const p of i) {
        const m = r.data[p];
        u.push({
          key: { status: "valid", value: p },
          value: f._parse(
            new Ye(r, m, r.path, p)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: p in r.data
        });
      }
    }
    return r.common.async ? Promise.resolve().then(async () => {
      const f = [];
      for (const p of u) {
        const m = await p.key, b = await p.value;
        f.push({
          key: m,
          value: b,
          alwaysSet: p.alwaysSet
        });
      }
      return f;
    }).then((f) => ke.mergeObjectSync(a, f)) : ke.mergeObjectSync(a, u);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return H.errToObj, new be({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, a) => {
          var r, s, l, i;
          const u = (l = (s = (r = this._def).errorMap) === null || s === void 0 ? void 0 : s.call(r, t, a).message) !== null && l !== void 0 ? l : a.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: (i = H.errToObj(e).message) !== null && i !== void 0 ? i : u
          } : {
            message: u
          };
        }
      } : {}
    });
  }
  strip() {
    return new be({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new be({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new be({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new be({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: W.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new be({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    return de.objectKeys(e).forEach((a) => {
      e[a] && this.shape[a] && (t[a] = this.shape[a]);
    }), new be({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    return de.objectKeys(this.shape).forEach((a) => {
      e[a] || (t[a] = this.shape[a]);
    }), new be({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return _r(this);
  }
  partial(e) {
    const t = {};
    return de.objectKeys(this.shape).forEach((a) => {
      const r = this.shape[a];
      e && !e[a] ? t[a] = r : t[a] = r.optional();
    }), new be({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    return de.objectKeys(this.shape).forEach((a) => {
      if (e && !e[a])
        t[a] = this.shape[a];
      else {
        let s = this.shape[a];
        for (; s instanceof Ge; )
          s = s._def.innerType;
        t[a] = s;
      }
    }), new be({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Ls(de.objectKeys(this.shape));
  }
}
be.create = (n, e) => new be({
  shape: () => n,
  unknownKeys: "strip",
  catchall: nr.create(),
  typeName: W.ZodObject,
  ...ae(e)
});
be.strictCreate = (n, e) => new be({
  shape: () => n,
  unknownKeys: "strict",
  catchall: nr.create(),
  typeName: W.ZodObject,
  ...ae(e)
});
be.lazycreate = (n, e) => new be({
  shape: n,
  unknownKeys: "strip",
  catchall: nr.create(),
  typeName: W.ZodObject,
  ...ae(e)
});
class Fr extends ne {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), a = this._def.options;
    function r(s) {
      for (const i of s)
        if (i.result.status === "valid")
          return i.result;
      for (const i of s)
        if (i.result.status === "dirty")
          return t.common.issues.push(...i.ctx.common.issues), i.result;
      const l = s.map((i) => new qe(i.ctx.common.issues));
      return z(t, {
        code: q.invalid_union,
        unionErrors: l
      }), G;
    }
    if (t.common.async)
      return Promise.all(a.map(async (s) => {
        const l = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await s._parseAsync({
            data: t.data,
            path: t.path,
            parent: l
          }),
          ctx: l
        };
      })).then(r);
    {
      let s;
      const l = [];
      for (const u of a) {
        const f = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, p = u._parseSync({
          data: t.data,
          path: t.path,
          parent: f
        });
        if (p.status === "valid")
          return p;
        p.status === "dirty" && !s && (s = { result: p, ctx: f }), f.common.issues.length && l.push(f.common.issues);
      }
      if (s)
        return t.common.issues.push(...s.ctx.common.issues), s.result;
      const i = l.map((u) => new qe(u));
      return z(t, {
        code: q.invalid_union,
        unionErrors: i
      }), G;
    }
  }
  get options() {
    return this._def.options;
  }
}
Fr.create = (n, e) => new Fr({
  options: n,
  typeName: W.ZodUnion,
  ...ae(e)
});
const ar = (n) => n instanceof Mr ? ar(n.schema) : n instanceof Je ? ar(n.innerType()) : n instanceof Ur ? [n.value] : n instanceof ur ? n.options : n instanceof zr ? de.objectValues(n.enum) : n instanceof Zr ? ar(n._def.innerType) : n instanceof Dr ? [void 0] : n instanceof Nr ? [null] : n instanceof Ge ? [void 0, ...ar(n.unwrap())] : n instanceof cr ? [null, ...ar(n.unwrap())] : n instanceof da || n instanceof Hr ? ar(n.unwrap()) : n instanceof Vr ? ar(n._def.innerType) : [];
class it extends ne {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== V.object)
      return z(t, {
        code: q.invalid_type,
        expected: V.object,
        received: t.parsedType
      }), G;
    const a = this.discriminator, r = t.data[a], s = this.optionsMap.get(r);
    return s ? t.common.async ? s._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : s._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (z(t, {
      code: q.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [a]
    }), G);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(e, t, a) {
    const r = /* @__PURE__ */ new Map();
    for (const s of t) {
      const l = ar(s.shape[e]);
      if (!l.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const i of l) {
        if (r.has(i))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(i)}`);
        r.set(i, s);
      }
    }
    return new it({
      typeName: W.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: r,
      ...ae(a)
    });
  }
}
function oa(n, e) {
  const t = sr(n), a = sr(e);
  if (n === e)
    return { valid: !0, data: n };
  if (t === V.object && a === V.object) {
    const r = de.objectKeys(e), s = de.objectKeys(n).filter((i) => r.indexOf(i) !== -1), l = { ...n, ...e };
    for (const i of s) {
      const u = oa(n[i], e[i]);
      if (!u.valid)
        return { valid: !1 };
      l[i] = u.data;
    }
    return { valid: !0, data: l };
  } else if (t === V.array && a === V.array) {
    if (n.length !== e.length)
      return { valid: !1 };
    const r = [];
    for (let s = 0; s < n.length; s++) {
      const l = n[s], i = e[s], u = oa(l, i);
      if (!u.valid)
        return { valid: !1 };
      r.push(u.data);
    }
    return { valid: !0, data: r };
  } else return t === V.date && a === V.date && +n == +e ? { valid: !0, data: n } : { valid: !1 };
}
class qr extends ne {
  _parse(e) {
    const { status: t, ctx: a } = this._processInputParams(e), r = (s, l) => {
      if (na(s) || na(l))
        return G;
      const i = oa(s.value, l.value);
      return i.valid ? ((ia(s) || ia(l)) && t.dirty(), { status: t.value, value: i.data }) : (z(a, {
        code: q.invalid_intersection_types
      }), G);
    };
    return a.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: a.data,
        path: a.path,
        parent: a
      }),
      this._def.right._parseAsync({
        data: a.data,
        path: a.path,
        parent: a
      })
    ]).then(([s, l]) => r(s, l)) : r(this._def.left._parseSync({
      data: a.data,
      path: a.path,
      parent: a
    }), this._def.right._parseSync({
      data: a.data,
      path: a.path,
      parent: a
    }));
  }
}
qr.create = (n, e, t) => new qr({
  left: n,
  right: e,
  typeName: W.ZodIntersection,
  ...ae(t)
});
class Xe extends ne {
  _parse(e) {
    const { status: t, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== V.array)
      return z(a, {
        code: q.invalid_type,
        expected: V.array,
        received: a.parsedType
      }), G;
    if (a.data.length < this._def.items.length)
      return z(a, {
        code: q.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), G;
    !this._def.rest && a.data.length > this._def.items.length && (z(a, {
      code: q.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const s = [...a.data].map((l, i) => {
      const u = this._def.items[i] || this._def.rest;
      return u ? u._parse(new Ye(a, l, a.path, i)) : null;
    }).filter((l) => !!l);
    return a.common.async ? Promise.all(s).then((l) => ke.mergeArray(t, l)) : ke.mergeArray(t, s);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new Xe({
      ...this._def,
      rest: e
    });
  }
}
Xe.create = (n, e) => {
  if (!Array.isArray(n))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Xe({
    items: n,
    typeName: W.ZodTuple,
    rest: null,
    ...ae(e)
  });
};
class Lr extends ne {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== V.object)
      return z(a, {
        code: q.invalid_type,
        expected: V.object,
        received: a.parsedType
      }), G;
    const r = [], s = this._def.keyType, l = this._def.valueType;
    for (const i in a.data)
      r.push({
        key: s._parse(new Ye(a, i, a.path, i)),
        value: l._parse(new Ye(a, a.data[i], a.path, i)),
        alwaysSet: i in a.data
      });
    return a.common.async ? ke.mergeObjectAsync(t, r) : ke.mergeObjectSync(t, r);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, a) {
    return t instanceof ne ? new Lr({
      keyType: e,
      valueType: t,
      typeName: W.ZodRecord,
      ...ae(a)
    }) : new Lr({
      keyType: Ve.create(),
      valueType: e,
      typeName: W.ZodRecord,
      ...ae(t)
    });
  }
}
class st extends ne {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== V.map)
      return z(a, {
        code: q.invalid_type,
        expected: V.map,
        received: a.parsedType
      }), G;
    const r = this._def.keyType, s = this._def.valueType, l = [...a.data.entries()].map(([i, u], f) => ({
      key: r._parse(new Ye(a, i, a.path, [f, "key"])),
      value: s._parse(new Ye(a, u, a.path, [f, "value"]))
    }));
    if (a.common.async) {
      const i = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const u of l) {
          const f = await u.key, p = await u.value;
          if (f.status === "aborted" || p.status === "aborted")
            return G;
          (f.status === "dirty" || p.status === "dirty") && t.dirty(), i.set(f.value, p.value);
        }
        return { status: t.value, value: i };
      });
    } else {
      const i = /* @__PURE__ */ new Map();
      for (const u of l) {
        const f = u.key, p = u.value;
        if (f.status === "aborted" || p.status === "aborted")
          return G;
        (f.status === "dirty" || p.status === "dirty") && t.dirty(), i.set(f.value, p.value);
      }
      return { status: t.value, value: i };
    }
  }
}
st.create = (n, e, t) => new st({
  valueType: e,
  keyType: n,
  typeName: W.ZodMap,
  ...ae(t)
});
class vr extends ne {
  _parse(e) {
    const { status: t, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== V.set)
      return z(a, {
        code: q.invalid_type,
        expected: V.set,
        received: a.parsedType
      }), G;
    const r = this._def;
    r.minSize !== null && a.data.size < r.minSize.value && (z(a, {
      code: q.too_small,
      minimum: r.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.minSize.message
    }), t.dirty()), r.maxSize !== null && a.data.size > r.maxSize.value && (z(a, {
      code: q.too_big,
      maximum: r.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.maxSize.message
    }), t.dirty());
    const s = this._def.valueType;
    function l(u) {
      const f = /* @__PURE__ */ new Set();
      for (const p of u) {
        if (p.status === "aborted")
          return G;
        p.status === "dirty" && t.dirty(), f.add(p.value);
      }
      return { status: t.value, value: f };
    }
    const i = [...a.data.values()].map((u, f) => s._parse(new Ye(a, u, a.path, f)));
    return a.common.async ? Promise.all(i).then((u) => l(u)) : l(i);
  }
  min(e, t) {
    return new vr({
      ...this._def,
      minSize: { value: e, message: H.toString(t) }
    });
  }
  max(e, t) {
    return new vr({
      ...this._def,
      maxSize: { value: e, message: H.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
vr.create = (n, e) => new vr({
  valueType: n,
  minSize: null,
  maxSize: null,
  typeName: W.ZodSet,
  ...ae(e)
});
class Pr extends ne {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== V.function)
      return z(t, {
        code: q.invalid_type,
        expected: V.function,
        received: t.parsedType
      }), G;
    function a(i, u) {
      return et({
        data: i,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          Xr(),
          Er
        ].filter((f) => !!f),
        issueData: {
          code: q.invalid_arguments,
          argumentsError: u
        }
      });
    }
    function r(i, u) {
      return et({
        data: i,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          Xr(),
          Er
        ].filter((f) => !!f),
        issueData: {
          code: q.invalid_return_type,
          returnTypeError: u
        }
      });
    }
    const s = { errorMap: t.common.contextualErrorMap }, l = t.data;
    if (this._def.returns instanceof wr) {
      const i = this;
      return De(async function(...u) {
        const f = new qe([]), p = await i._def.args.parseAsync(u, s).catch((c) => {
          throw f.addIssue(a(u, c)), f;
        }), m = await Reflect.apply(l, this, p);
        return await i._def.returns._def.type.parseAsync(m, s).catch((c) => {
          throw f.addIssue(r(m, c)), f;
        });
      });
    } else {
      const i = this;
      return De(function(...u) {
        const f = i._def.args.safeParse(u, s);
        if (!f.success)
          throw new qe([a(u, f.error)]);
        const p = Reflect.apply(l, this, f.data), m = i._def.returns.safeParse(p, s);
        if (!m.success)
          throw new qe([r(p, m.error)]);
        return m.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...e) {
    return new Pr({
      ...this._def,
      args: Xe.create(e).rest(hr.create())
    });
  }
  returns(e) {
    return new Pr({
      ...this._def,
      returns: e
    });
  }
  implement(e) {
    return this.parse(e);
  }
  strictImplement(e) {
    return this.parse(e);
  }
  static create(e, t, a) {
    return new Pr({
      args: e || Xe.create([]).rest(hr.create()),
      returns: t || hr.create(),
      typeName: W.ZodFunction,
      ...ae(a)
    });
  }
}
class Mr extends ne {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
Mr.create = (n, e) => new Mr({
  getter: n,
  typeName: W.ZodLazy,
  ...ae(e)
});
class Ur extends ne {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return z(t, {
        received: t.data,
        code: q.invalid_literal,
        expected: this._def.value
      }), G;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Ur.create = (n, e) => new Ur({
  value: n,
  typeName: W.ZodLiteral,
  ...ae(e)
});
function Ls(n, e) {
  return new ur({
    values: n,
    typeName: W.ZodEnum,
    ...ae(e)
  });
}
class ur extends ne {
  constructor() {
    super(...arguments), Tr.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), a = this._def.values;
      return z(t, {
        expected: de.joinValues(a),
        received: t.parsedType,
        code: q.invalid_type
      }), G;
    }
    if (rt(this, Tr) || Ds(this, Tr, new Set(this._def.values)), !rt(this, Tr).has(e.data)) {
      const t = this._getOrReturnCtx(e), a = this._def.values;
      return z(t, {
        received: t.data,
        code: q.invalid_enum_value,
        options: a
      }), G;
    }
    return De(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return ur.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return ur.create(this.options.filter((a) => !e.includes(a)), {
      ...this._def,
      ...t
    });
  }
}
Tr = /* @__PURE__ */ new WeakMap();
ur.create = Ls;
class zr extends ne {
  constructor() {
    super(...arguments), Ar.set(this, void 0);
  }
  _parse(e) {
    const t = de.getValidEnumValues(this._def.values), a = this._getOrReturnCtx(e);
    if (a.parsedType !== V.string && a.parsedType !== V.number) {
      const r = de.objectValues(t);
      return z(a, {
        expected: de.joinValues(r),
        received: a.parsedType,
        code: q.invalid_type
      }), G;
    }
    if (rt(this, Ar) || Ds(this, Ar, new Set(de.getValidEnumValues(this._def.values))), !rt(this, Ar).has(e.data)) {
      const r = de.objectValues(t);
      return z(a, {
        received: a.data,
        code: q.invalid_enum_value,
        options: r
      }), G;
    }
    return De(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Ar = /* @__PURE__ */ new WeakMap();
zr.create = (n, e) => new zr({
  values: n,
  typeName: W.ZodNativeEnum,
  ...ae(e)
});
class wr extends ne {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== V.promise && t.common.async === !1)
      return z(t, {
        code: q.invalid_type,
        expected: V.promise,
        received: t.parsedType
      }), G;
    const a = t.parsedType === V.promise ? t.data : Promise.resolve(t.data);
    return De(a.then((r) => this._def.type.parseAsync(r, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
wr.create = (n, e) => new wr({
  type: n,
  typeName: W.ZodPromise,
  ...ae(e)
});
class Je extends ne {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === W.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: a } = this._processInputParams(e), r = this._def.effect || null, s = {
      addIssue: (l) => {
        z(a, l), l.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return a.path;
      }
    };
    if (s.addIssue = s.addIssue.bind(s), r.type === "preprocess") {
      const l = r.transform(a.data, s);
      if (a.common.async)
        return Promise.resolve(l).then(async (i) => {
          if (t.value === "aborted")
            return G;
          const u = await this._def.schema._parseAsync({
            data: i,
            path: a.path,
            parent: a
          });
          return u.status === "aborted" ? G : u.status === "dirty" || t.value === "dirty" ? br(u.value) : u;
        });
      {
        if (t.value === "aborted")
          return G;
        const i = this._def.schema._parseSync({
          data: l,
          path: a.path,
          parent: a
        });
        return i.status === "aborted" ? G : i.status === "dirty" || t.value === "dirty" ? br(i.value) : i;
      }
    }
    if (r.type === "refinement") {
      const l = (i) => {
        const u = r.refinement(i, s);
        if (a.common.async)
          return Promise.resolve(u);
        if (u instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return i;
      };
      if (a.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: a.data,
          path: a.path,
          parent: a
        });
        return i.status === "aborted" ? G : (i.status === "dirty" && t.dirty(), l(i.value), { status: t.value, value: i.value });
      } else
        return this._def.schema._parseAsync({ data: a.data, path: a.path, parent: a }).then((i) => i.status === "aborted" ? G : (i.status === "dirty" && t.dirty(), l(i.value).then(() => ({ status: t.value, value: i.value }))));
    }
    if (r.type === "transform")
      if (a.common.async === !1) {
        const l = this._def.schema._parseSync({
          data: a.data,
          path: a.path,
          parent: a
        });
        if (!pr(l))
          return l;
        const i = r.transform(l.value, s);
        if (i instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: i };
      } else
        return this._def.schema._parseAsync({ data: a.data, path: a.path, parent: a }).then((l) => pr(l) ? Promise.resolve(r.transform(l.value, s)).then((i) => ({ status: t.value, value: i })) : l);
    de.assertNever(r);
  }
}
Je.create = (n, e, t) => new Je({
  schema: n,
  typeName: W.ZodEffects,
  effect: e,
  ...ae(t)
});
Je.createWithPreprocess = (n, e, t) => new Je({
  schema: e,
  effect: { type: "preprocess", transform: n },
  typeName: W.ZodEffects,
  ...ae(t)
});
class Ge extends ne {
  _parse(e) {
    return this._getType(e) === V.undefined ? De(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Ge.create = (n, e) => new Ge({
  innerType: n,
  typeName: W.ZodOptional,
  ...ae(e)
});
class cr extends ne {
  _parse(e) {
    return this._getType(e) === V.null ? De(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
cr.create = (n, e) => new cr({
  innerType: n,
  typeName: W.ZodNullable,
  ...ae(e)
});
class Zr extends ne {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let a = t.data;
    return t.parsedType === V.undefined && (a = this._def.defaultValue()), this._def.innerType._parse({
      data: a,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Zr.create = (n, e) => new Zr({
  innerType: n,
  typeName: W.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...ae(e)
});
class Vr extends ne {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), a = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, r = this._def.innerType._parse({
      data: a.data,
      path: a.path,
      parent: {
        ...a
      }
    });
    return Cr(r) ? r.then((s) => ({
      status: "valid",
      value: s.status === "valid" ? s.value : this._def.catchValue({
        get error() {
          return new qe(a.common.issues);
        },
        input: a.data
      })
    })) : {
      status: "valid",
      value: r.status === "valid" ? r.value : this._def.catchValue({
        get error() {
          return new qe(a.common.issues);
        },
        input: a.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
Vr.create = (n, e) => new Vr({
  innerType: n,
  typeName: W.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...ae(e)
});
class nt extends ne {
  _parse(e) {
    if (this._getType(e) !== V.nan) {
      const a = this._getOrReturnCtx(e);
      return z(a, {
        code: q.invalid_type,
        expected: V.nan,
        received: a.parsedType
      }), G;
    }
    return { status: "valid", value: e.data };
  }
}
nt.create = (n) => new nt({
  typeName: W.ZodNaN,
  ...ae(n)
});
const ei = Symbol("zod_brand");
class da extends ne {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), a = t.data;
    return this._def.type._parse({
      data: a,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class Jr extends ne {
  _parse(e) {
    const { status: t, ctx: a } = this._processInputParams(e);
    if (a.common.async)
      return (async () => {
        const s = await this._def.in._parseAsync({
          data: a.data,
          path: a.path,
          parent: a
        });
        return s.status === "aborted" ? G : s.status === "dirty" ? (t.dirty(), br(s.value)) : this._def.out._parseAsync({
          data: s.value,
          path: a.path,
          parent: a
        });
      })();
    {
      const r = this._def.in._parseSync({
        data: a.data,
        path: a.path,
        parent: a
      });
      return r.status === "aborted" ? G : r.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: r.value
      }) : this._def.out._parseSync({
        data: r.value,
        path: a.path,
        parent: a
      });
    }
  }
  static create(e, t) {
    return new Jr({
      in: e,
      out: t,
      typeName: W.ZodPipeline
    });
  }
}
class Hr extends ne {
  _parse(e) {
    const t = this._def.innerType._parse(e), a = (r) => (pr(r) && (r.value = Object.freeze(r.value)), r);
    return Cr(t) ? t.then((r) => a(r)) : a(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Hr.create = (n, e) => new Hr({
  innerType: n,
  typeName: W.ZodReadonly,
  ...ae(e)
});
function Na(n, e) {
  const t = typeof n == "function" ? n(e) : typeof n == "string" ? { message: n } : n;
  return typeof t == "string" ? { message: t } : t;
}
function Ms(n, e = {}, t) {
  return n ? Sr.create().superRefine((a, r) => {
    var s, l;
    const i = n(a);
    if (i instanceof Promise)
      return i.then((u) => {
        var f, p;
        if (!u) {
          const m = Na(e, a), b = (p = (f = m.fatal) !== null && f !== void 0 ? f : t) !== null && p !== void 0 ? p : !0;
          r.addIssue({ code: "custom", ...m, fatal: b });
        }
      });
    if (!i) {
      const u = Na(e, a), f = (l = (s = u.fatal) !== null && s !== void 0 ? s : t) !== null && l !== void 0 ? l : !0;
      r.addIssue({ code: "custom", ...u, fatal: f });
    }
  }) : Sr.create();
}
const ri = {
  object: be.lazycreate
};
var W;
(function(n) {
  n.ZodString = "ZodString", n.ZodNumber = "ZodNumber", n.ZodNaN = "ZodNaN", n.ZodBigInt = "ZodBigInt", n.ZodBoolean = "ZodBoolean", n.ZodDate = "ZodDate", n.ZodSymbol = "ZodSymbol", n.ZodUndefined = "ZodUndefined", n.ZodNull = "ZodNull", n.ZodAny = "ZodAny", n.ZodUnknown = "ZodUnknown", n.ZodNever = "ZodNever", n.ZodVoid = "ZodVoid", n.ZodArray = "ZodArray", n.ZodObject = "ZodObject", n.ZodUnion = "ZodUnion", n.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", n.ZodIntersection = "ZodIntersection", n.ZodTuple = "ZodTuple", n.ZodRecord = "ZodRecord", n.ZodMap = "ZodMap", n.ZodSet = "ZodSet", n.ZodFunction = "ZodFunction", n.ZodLazy = "ZodLazy", n.ZodLiteral = "ZodLiteral", n.ZodEnum = "ZodEnum", n.ZodEffects = "ZodEffects", n.ZodNativeEnum = "ZodNativeEnum", n.ZodOptional = "ZodOptional", n.ZodNullable = "ZodNullable", n.ZodDefault = "ZodDefault", n.ZodCatch = "ZodCatch", n.ZodPromise = "ZodPromise", n.ZodBranded = "ZodBranded", n.ZodPipeline = "ZodPipeline", n.ZodReadonly = "ZodReadonly";
})(W || (W = {}));
const ti = (n, e = {
  message: `Input not instance of ${n.name}`
}) => Ms((t) => t instanceof n, e), Us = Ve.create, zs = or.create, ai = nt.create, si = lr.create, Zs = jr.create, ni = mr.create, ii = tt.create, oi = Dr.create, li = Nr.create, ui = Sr.create, ci = hr.create, di = nr.create, fi = at.create, hi = He.create, pi = be.create, mi = be.strictCreate, vi = Fr.create, gi = it.create, yi = qr.create, _i = Xe.create, bi = Lr.create, Pi = st.create, Ei = vr.create, Si = Pr.create, wi = Mr.create, xi = Ur.create, Ri = ur.create, Ii = zr.create, Oi = wr.create, Fa = Je.create, $i = Ge.create, Ti = cr.create, Ai = Je.createWithPreprocess, ki = Jr.create, Ci = () => Us().optional(), ji = () => zs().optional(), Di = () => Zs().optional(), Ni = {
  string: (n) => Ve.create({ ...n, coerce: !0 }),
  number: (n) => or.create({ ...n, coerce: !0 }),
  boolean: (n) => jr.create({
    ...n,
    coerce: !0
  }),
  bigint: (n) => lr.create({ ...n, coerce: !0 }),
  date: (n) => mr.create({ ...n, coerce: !0 })
}, Fi = G;
var o = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: Er,
  setErrorMap: An,
  getErrorMap: Xr,
  makeIssue: et,
  EMPTY_PATH: kn,
  addIssueToContext: z,
  ParseStatus: ke,
  INVALID: G,
  DIRTY: br,
  OK: De,
  isAborted: na,
  isDirty: ia,
  isValid: pr,
  isAsync: Cr,
  get util() {
    return de;
  },
  get objectUtil() {
    return sa;
  },
  ZodParsedType: V,
  getParsedType: sr,
  ZodType: ne,
  datetimeRegex: qs,
  ZodString: Ve,
  ZodNumber: or,
  ZodBigInt: lr,
  ZodBoolean: jr,
  ZodDate: mr,
  ZodSymbol: tt,
  ZodUndefined: Dr,
  ZodNull: Nr,
  ZodAny: Sr,
  ZodUnknown: hr,
  ZodNever: nr,
  ZodVoid: at,
  ZodArray: He,
  ZodObject: be,
  ZodUnion: Fr,
  ZodDiscriminatedUnion: it,
  ZodIntersection: qr,
  ZodTuple: Xe,
  ZodRecord: Lr,
  ZodMap: st,
  ZodSet: vr,
  ZodFunction: Pr,
  ZodLazy: Mr,
  ZodLiteral: Ur,
  ZodEnum: ur,
  ZodNativeEnum: zr,
  ZodPromise: wr,
  ZodEffects: Je,
  ZodTransformer: Je,
  ZodOptional: Ge,
  ZodNullable: cr,
  ZodDefault: Zr,
  ZodCatch: Vr,
  ZodNaN: nt,
  BRAND: ei,
  ZodBranded: da,
  ZodPipeline: Jr,
  ZodReadonly: Hr,
  custom: Ms,
  Schema: ne,
  ZodSchema: ne,
  late: ri,
  get ZodFirstPartyTypeKind() {
    return W;
  },
  coerce: Ni,
  any: ui,
  array: hi,
  bigint: si,
  boolean: Zs,
  date: ni,
  discriminatedUnion: gi,
  effect: Fa,
  enum: Ri,
  function: Si,
  instanceof: ti,
  intersection: yi,
  lazy: wi,
  literal: xi,
  map: Pi,
  nan: ai,
  nativeEnum: Ii,
  never: di,
  null: li,
  nullable: Ti,
  number: zs,
  object: pi,
  oboolean: Di,
  onumber: ji,
  optional: $i,
  ostring: Ci,
  pipeline: ki,
  preprocess: Ai,
  promise: Oi,
  record: bi,
  set: Ei,
  strictObject: mi,
  string: Us,
  symbol: ii,
  transformer: Fa,
  tuple: _i,
  undefined: oi,
  union: vi,
  unknown: ci,
  void: fi,
  NEVER: Fi,
  ZodIssueCode: q,
  quotelessJson: Tn,
  ZodError: qe
});
const Vs = "2025-06-18", qi = [
  Vs,
  "2025-03-26",
  "2024-11-05",
  "2024-10-07"
], ot = "2.0", Hs = o.union([o.string(), o.number().int()]), Js = o.string(), Li = o.object({
  /**
   * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
   */
  progressToken: o.optional(Hs)
}).passthrough(), Ue = o.object({
  _meta: o.optional(Li)
}).passthrough(), Fe = o.object({
  method: o.string(),
  params: o.optional(Ue)
}), Br = o.object({
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: o.optional(o.object({}).passthrough())
}).passthrough(), er = o.object({
  method: o.string(),
  params: o.optional(Br)
}), ze = o.object({
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: o.optional(o.object({}).passthrough())
}).passthrough(), lt = o.union([o.string(), o.number().int()]), Bs = o.object({
  jsonrpc: o.literal(ot),
  id: lt
}).merge(Fe).strict(), Mi = (n) => Bs.safeParse(n).success, Ks = o.object({
  jsonrpc: o.literal(ot)
}).merge(er).strict(), Ui = (n) => Ks.safeParse(n).success, Qs = o.object({
  jsonrpc: o.literal(ot),
  id: lt,
  result: ze
}).strict(), qa = (n) => Qs.safeParse(n).success;
var Ie;
(function(n) {
  n[n.ConnectionClosed = -32e3] = "ConnectionClosed", n[n.RequestTimeout = -32001] = "RequestTimeout", n[n.ParseError = -32700] = "ParseError", n[n.InvalidRequest = -32600] = "InvalidRequest", n[n.MethodNotFound = -32601] = "MethodNotFound", n[n.InvalidParams = -32602] = "InvalidParams", n[n.InternalError = -32603] = "InternalError";
})(Ie || (Ie = {}));
const Ws = o.object({
  jsonrpc: o.literal(ot),
  id: lt,
  error: o.object({
    /**
     * The error type that occurred.
     */
    code: o.number().int(),
    /**
     * A short description of the error. The message SHOULD be limited to a concise single sentence.
     */
    message: o.string(),
    /**
     * Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
     */
    data: o.optional(o.unknown())
  })
}).strict(), zi = (n) => Ws.safeParse(n).success, Zi = o.union([
  Bs,
  Ks,
  Qs,
  Ws
]), fa = ze.strict(), ha = er.extend({
  method: o.literal("notifications/cancelled"),
  params: Br.extend({
    /**
     * The ID of the request to cancel.
     *
     * This MUST correspond to the ID of a request previously issued in the same direction.
     */
    requestId: lt,
    /**
     * An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
     */
    reason: o.string().optional()
  })
}), Kr = o.object({
  /** Intended for programmatic or logical use, but used as a display name in past specs or fallback */
  name: o.string(),
  /**
  * Intended for UI and end-user contexts — optimized to be human-readable and easily understood,
  * even by those unfamiliar with domain-specific terminology.
  *
  * If not provided, the name should be used for display (except for Tool,
  * where `annotations.title` should be given precedence over using `name`,
  * if present).
  */
  title: o.optional(o.string())
}).passthrough(), Gs = Kr.extend({
  version: o.string()
}), Vi = o.object({
  /**
   * Experimental, non-standard capabilities that the client supports.
   */
  experimental: o.optional(o.object({}).passthrough()),
  /**
   * Present if the client supports sampling from an LLM.
   */
  sampling: o.optional(o.object({}).passthrough()),
  /**
   * Present if the client supports eliciting user input.
   */
  elicitation: o.optional(o.object({}).passthrough()),
  /**
   * Present if the client supports listing roots.
   */
  roots: o.optional(o.object({
    /**
     * Whether the client supports issuing notifications for changes to the roots list.
     */
    listChanged: o.optional(o.boolean())
  }).passthrough())
}).passthrough(), Ys = Fe.extend({
  method: o.literal("initialize"),
  params: Ue.extend({
    /**
     * The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
     */
    protocolVersion: o.string(),
    capabilities: Vi,
    clientInfo: Gs
  })
}), Hi = o.object({
  /**
   * Experimental, non-standard capabilities that the server supports.
   */
  experimental: o.optional(o.object({}).passthrough()),
  /**
   * Present if the server supports sending log messages to the client.
   */
  logging: o.optional(o.object({}).passthrough()),
  /**
   * Present if the server supports sending completions to the client.
   */
  completions: o.optional(o.object({}).passthrough()),
  /**
   * Present if the server offers any prompt templates.
   */
  prompts: o.optional(o.object({
    /**
     * Whether this server supports issuing notifications for changes to the prompt list.
     */
    listChanged: o.optional(o.boolean())
  }).passthrough()),
  /**
   * Present if the server offers any resources to read.
   */
  resources: o.optional(o.object({
    /**
     * Whether this server supports clients subscribing to resource updates.
     */
    subscribe: o.optional(o.boolean()),
    /**
     * Whether this server supports issuing notifications for changes to the resource list.
     */
    listChanged: o.optional(o.boolean())
  }).passthrough()),
  /**
   * Present if the server offers any tools to call.
   */
  tools: o.optional(o.object({
    /**
     * Whether this server supports issuing notifications for changes to the tool list.
     */
    listChanged: o.optional(o.boolean())
  }).passthrough())
}).passthrough(), Ji = ze.extend({
  /**
   * The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
   */
  protocolVersion: o.string(),
  capabilities: Hi,
  serverInfo: Gs,
  /**
   * Instructions describing how to use the server and its features.
   *
   * This can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a "hint" to the model. For example, this information MAY be added to the system prompt.
   */
  instructions: o.optional(o.string())
}), Xs = er.extend({
  method: o.literal("notifications/initialized")
}), pa = Fe.extend({
  method: o.literal("ping")
}), Bi = o.object({
  /**
   * The progress thus far. This should increase every time progress is made, even if the total is unknown.
   */
  progress: o.number(),
  /**
   * Total number of items to process (or total progress required), if known.
   */
  total: o.optional(o.number()),
  /**
   * An optional message describing the current progress.
   */
  message: o.optional(o.string())
}).passthrough(), ma = er.extend({
  method: o.literal("notifications/progress"),
  params: Br.merge(Bi).extend({
    /**
     * The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
     */
    progressToken: Hs
  })
}), ut = Fe.extend({
  params: Ue.extend({
    /**
     * An opaque token representing the current pagination position.
     * If provided, the server should return results starting after this cursor.
     */
    cursor: o.optional(Js)
  }).optional()
}), ct = ze.extend({
  /**
   * An opaque token representing the pagination position after the last returned result.
   * If present, there may be more results available.
   */
  nextCursor: o.optional(Js)
}), en = o.object({
  /**
   * The URI of this resource.
   */
  uri: o.string(),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: o.optional(o.string()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: o.optional(o.object({}).passthrough())
}).passthrough(), rn = en.extend({
  /**
   * The text of the item. This must only be set if the item can actually be represented as text (not binary data).
   */
  text: o.string()
}), tn = en.extend({
  /**
   * A base64-encoded string representing the binary data of the item.
   */
  blob: o.string().base64()
}), an = Kr.extend({
  /**
   * The URI of this resource.
   */
  uri: o.string(),
  /**
   * A description of what this resource represents.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: o.optional(o.string()),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: o.optional(o.string()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: o.optional(o.object({}).passthrough())
}), Ki = Kr.extend({
  /**
   * A URI template (according to RFC 6570) that can be used to construct resource URIs.
   */
  uriTemplate: o.string(),
  /**
   * A description of what this template is for.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: o.optional(o.string()),
  /**
   * The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
   */
  mimeType: o.optional(o.string()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: o.optional(o.object({}).passthrough())
}), Qi = ut.extend({
  method: o.literal("resources/list")
}), Wi = ct.extend({
  resources: o.array(an)
}), Gi = ut.extend({
  method: o.literal("resources/templates/list")
}), Yi = ct.extend({
  resourceTemplates: o.array(Ki)
}), Xi = Fe.extend({
  method: o.literal("resources/read"),
  params: Ue.extend({
    /**
     * The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.
     */
    uri: o.string()
  })
}), eo = ze.extend({
  contents: o.array(o.union([rn, tn]))
}), ro = er.extend({
  method: o.literal("notifications/resources/list_changed")
}), to = Fe.extend({
  method: o.literal("resources/subscribe"),
  params: Ue.extend({
    /**
     * The URI of the resource to subscribe to. The URI can use any protocol; it is up to the server how to interpret it.
     */
    uri: o.string()
  })
}), ao = Fe.extend({
  method: o.literal("resources/unsubscribe"),
  params: Ue.extend({
    /**
     * The URI of the resource to unsubscribe from.
     */
    uri: o.string()
  })
}), so = er.extend({
  method: o.literal("notifications/resources/updated"),
  params: Br.extend({
    /**
     * The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.
     */
    uri: o.string()
  })
}), no = o.object({
  /**
   * The name of the argument.
   */
  name: o.string(),
  /**
   * A human-readable description of the argument.
   */
  description: o.optional(o.string()),
  /**
   * Whether this argument must be provided.
   */
  required: o.optional(o.boolean())
}).passthrough(), io = Kr.extend({
  /**
   * An optional description of what this prompt provides
   */
  description: o.optional(o.string()),
  /**
   * A list of arguments to use for templating the prompt.
   */
  arguments: o.optional(o.array(no)),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: o.optional(o.object({}).passthrough())
}), oo = ut.extend({
  method: o.literal("prompts/list")
}), lo = ct.extend({
  prompts: o.array(io)
}), uo = Fe.extend({
  method: o.literal("prompts/get"),
  params: Ue.extend({
    /**
     * The name of the prompt or prompt template.
     */
    name: o.string(),
    /**
     * Arguments to use for templating the prompt.
     */
    arguments: o.optional(o.record(o.string()))
  })
}), va = o.object({
  type: o.literal("text"),
  /**
   * The text content of the message.
   */
  text: o.string(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: o.optional(o.object({}).passthrough())
}).passthrough(), ga = o.object({
  type: o.literal("image"),
  /**
   * The base64-encoded image data.
   */
  data: o.string().base64(),
  /**
   * The MIME type of the image. Different providers may support different image types.
   */
  mimeType: o.string(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: o.optional(o.object({}).passthrough())
}).passthrough(), ya = o.object({
  type: o.literal("audio"),
  /**
   * The base64-encoded audio data.
   */
  data: o.string().base64(),
  /**
   * The MIME type of the audio. Different providers may support different audio types.
   */
  mimeType: o.string(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: o.optional(o.object({}).passthrough())
}).passthrough(), co = o.object({
  type: o.literal("resource"),
  resource: o.union([rn, tn]),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: o.optional(o.object({}).passthrough())
}).passthrough(), fo = an.extend({
  type: o.literal("resource_link")
}), sn = o.union([
  va,
  ga,
  ya,
  fo,
  co
]), ho = o.object({
  role: o.enum(["user", "assistant"]),
  content: sn
}).passthrough(), po = ze.extend({
  /**
   * An optional description for the prompt.
   */
  description: o.optional(o.string()),
  messages: o.array(ho)
}), mo = er.extend({
  method: o.literal("notifications/prompts/list_changed")
}), vo = o.object({
  /**
   * A human-readable title for the tool.
   */
  title: o.optional(o.string()),
  /**
   * If true, the tool does not modify its environment.
   *
   * Default: false
   */
  readOnlyHint: o.optional(o.boolean()),
  /**
   * If true, the tool may perform destructive updates to its environment.
   * If false, the tool performs only additive updates.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: true
   */
  destructiveHint: o.optional(o.boolean()),
  /**
   * If true, calling the tool repeatedly with the same arguments
   * will have no additional effect on the its environment.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: false
   */
  idempotentHint: o.optional(o.boolean()),
  /**
   * If true, this tool may interact with an "open world" of external
   * entities. If false, the tool's domain of interaction is closed.
   * For example, the world of a web search tool is open, whereas that
   * of a memory tool is not.
   *
   * Default: true
   */
  openWorldHint: o.optional(o.boolean())
}).passthrough(), go = Kr.extend({
  /**
   * A human-readable description of the tool.
   */
  description: o.optional(o.string()),
  /**
   * A JSON Schema object defining the expected parameters for the tool.
   */
  inputSchema: o.object({
    type: o.literal("object"),
    properties: o.optional(o.object({}).passthrough()),
    required: o.optional(o.array(o.string()))
  }).passthrough(),
  /**
   * An optional JSON Schema object defining the structure of the tool's output returned in
   * the structuredContent field of a CallToolResult.
   */
  outputSchema: o.optional(o.object({
    type: o.literal("object"),
    properties: o.optional(o.object({}).passthrough()),
    required: o.optional(o.array(o.string()))
  }).passthrough()),
  /**
   * Optional additional tool information.
   */
  annotations: o.optional(vo),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: o.optional(o.object({}).passthrough())
}), nn = ut.extend({
  method: o.literal("tools/list")
}), yo = ct.extend({
  tools: o.array(go)
}), on = ze.extend({
  /**
   * A list of content objects that represent the result of the tool call.
   *
   * If the Tool does not define an outputSchema, this field MUST be present in the result.
   * For backwards compatibility, this field is always present, but it may be empty.
   */
  content: o.array(sn).default([]),
  /**
   * An object containing structured tool output.
   *
   * If the Tool defines an outputSchema, this field MUST be present in the result, and contain a JSON object that matches the schema.
   */
  structuredContent: o.object({}).passthrough().optional(),
  /**
   * Whether the tool call ended in an error.
   *
   * If not set, this is assumed to be false (the call was successful).
   *
   * Any errors that originate from the tool SHOULD be reported inside the result
   * object, with `isError` set to true, _not_ as an MCP protocol-level error
   * response. Otherwise, the LLM would not be able to see that an error occurred
   * and self-correct.
   *
   * However, any errors in _finding_ the tool, an error indicating that the
   * server does not support tool calls, or any other exceptional conditions,
   * should be reported as an MCP error response.
   */
  isError: o.optional(o.boolean())
});
on.or(ze.extend({
  toolResult: o.unknown()
}));
const ln = Fe.extend({
  method: o.literal("tools/call"),
  params: Ue.extend({
    name: o.string(),
    arguments: o.optional(o.record(o.unknown()))
  })
}), _o = er.extend({
  method: o.literal("notifications/tools/list_changed")
}), un = o.enum([
  "debug",
  "info",
  "notice",
  "warning",
  "error",
  "critical",
  "alert",
  "emergency"
]), bo = Fe.extend({
  method: o.literal("logging/setLevel"),
  params: Ue.extend({
    /**
     * The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/logging/message.
     */
    level: un
  })
}), Po = er.extend({
  method: o.literal("notifications/message"),
  params: Br.extend({
    /**
     * The severity of this log message.
     */
    level: un,
    /**
     * An optional name of the logger issuing this message.
     */
    logger: o.optional(o.string()),
    /**
     * The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
     */
    data: o.unknown()
  })
}), Eo = o.object({
  /**
   * A hint for a model name.
   */
  name: o.string().optional()
}).passthrough(), So = o.object({
  /**
   * Optional hints to use for model selection.
   */
  hints: o.optional(o.array(Eo)),
  /**
   * How much to prioritize cost when selecting a model.
   */
  costPriority: o.optional(o.number().min(0).max(1)),
  /**
   * How much to prioritize sampling speed (latency) when selecting a model.
   */
  speedPriority: o.optional(o.number().min(0).max(1)),
  /**
   * How much to prioritize intelligence and capabilities when selecting a model.
   */
  intelligencePriority: o.optional(o.number().min(0).max(1))
}).passthrough(), wo = o.object({
  role: o.enum(["user", "assistant"]),
  content: o.union([va, ga, ya])
}).passthrough(), xo = Fe.extend({
  method: o.literal("sampling/createMessage"),
  params: Ue.extend({
    messages: o.array(wo),
    /**
     * An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
     */
    systemPrompt: o.optional(o.string()),
    /**
     * A request to include context from one or more MCP servers (including the caller), to be attached to the prompt. The client MAY ignore this request.
     */
    includeContext: o.optional(o.enum(["none", "thisServer", "allServers"])),
    temperature: o.optional(o.number()),
    /**
     * The maximum number of tokens to sample, as requested by the server. The client MAY choose to sample fewer tokens than requested.
     */
    maxTokens: o.number().int(),
    stopSequences: o.optional(o.array(o.string())),
    /**
     * Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
     */
    metadata: o.optional(o.object({}).passthrough()),
    /**
     * The server's preferences for which model to select.
     */
    modelPreferences: o.optional(So)
  })
}), cn = ze.extend({
  /**
   * The name of the model that generated the message.
   */
  model: o.string(),
  /**
   * The reason why sampling stopped.
   */
  stopReason: o.optional(o.enum(["endTurn", "stopSequence", "maxTokens"]).or(o.string())),
  role: o.enum(["user", "assistant"]),
  content: o.discriminatedUnion("type", [
    va,
    ga,
    ya
  ])
}), Ro = o.object({
  type: o.literal("boolean"),
  title: o.optional(o.string()),
  description: o.optional(o.string()),
  default: o.optional(o.boolean())
}).passthrough(), Io = o.object({
  type: o.literal("string"),
  title: o.optional(o.string()),
  description: o.optional(o.string()),
  minLength: o.optional(o.number()),
  maxLength: o.optional(o.number()),
  format: o.optional(o.enum(["email", "uri", "date", "date-time"]))
}).passthrough(), Oo = o.object({
  type: o.enum(["number", "integer"]),
  title: o.optional(o.string()),
  description: o.optional(o.string()),
  minimum: o.optional(o.number()),
  maximum: o.optional(o.number())
}).passthrough(), $o = o.object({
  type: o.literal("string"),
  title: o.optional(o.string()),
  description: o.optional(o.string()),
  enum: o.array(o.string()),
  enumNames: o.optional(o.array(o.string()))
}).passthrough(), To = o.union([
  Ro,
  Io,
  Oo,
  $o
]), Ao = Fe.extend({
  method: o.literal("elicitation/create"),
  params: Ue.extend({
    /**
     * The message to present to the user.
     */
    message: o.string(),
    /**
     * The schema for the requested user input.
     */
    requestedSchema: o.object({
      type: o.literal("object"),
      properties: o.record(o.string(), To),
      required: o.optional(o.array(o.string()))
    }).passthrough()
  })
}), dn = ze.extend({
  /**
   * The user's response action.
   */
  action: o.enum(["accept", "decline", "cancel"]),
  /**
   * The collected user input content (only present if action is "accept").
   */
  content: o.optional(o.record(o.string(), o.unknown()))
}), ko = o.object({
  type: o.literal("ref/resource"),
  /**
   * The URI or URI template of the resource.
   */
  uri: o.string()
}).passthrough(), Co = o.object({
  type: o.literal("ref/prompt"),
  /**
   * The name of the prompt or prompt template
   */
  name: o.string()
}).passthrough(), jo = Fe.extend({
  method: o.literal("completion/complete"),
  params: Ue.extend({
    ref: o.union([Co, ko]),
    /**
     * The argument's information
     */
    argument: o.object({
      /**
       * The name of the argument
       */
      name: o.string(),
      /**
       * The value of the argument to use for completion matching.
       */
      value: o.string()
    }).passthrough(),
    context: o.optional(o.object({
      /**
       * Previously-resolved variables in a URI template or prompt.
       */
      arguments: o.optional(o.record(o.string(), o.string()))
    }))
  })
}), Do = ze.extend({
  completion: o.object({
    /**
     * An array of completion values. Must not exceed 100 items.
     */
    values: o.array(o.string()).max(100),
    /**
     * The total number of completion options available. This can exceed the number of values actually sent in the response.
     */
    total: o.optional(o.number().int()),
    /**
     * Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
     */
    hasMore: o.optional(o.boolean())
  }).passthrough()
}), No = o.object({
  /**
   * The URI identifying the root. This *must* start with file:// for now.
   */
  uri: o.string().startsWith("file://"),
  /**
   * An optional name for the root.
   */
  name: o.optional(o.string()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: o.optional(o.object({}).passthrough())
}).passthrough(), Fo = Fe.extend({
  method: o.literal("roots/list")
}), fn = ze.extend({
  roots: o.array(No)
}), qo = er.extend({
  method: o.literal("notifications/roots/list_changed")
});
o.union([
  pa,
  Ys,
  jo,
  bo,
  uo,
  oo,
  Qi,
  Gi,
  Xi,
  to,
  ao,
  ln,
  nn
]);
o.union([
  ha,
  ma,
  Xs,
  qo
]);
o.union([
  fa,
  cn,
  dn,
  fn
]);
o.union([
  pa,
  xo,
  Ao,
  Fo
]);
o.union([
  ha,
  ma,
  Po,
  so,
  ro,
  _o,
  mo
]);
o.union([
  fa,
  Ji,
  Do,
  po,
  lo,
  Wi,
  Yi,
  eo,
  on,
  yo
]);
class Oe extends Error {
  constructor(e, t, a) {
    super(`MCP error ${e}: ${t}`), this.code = e, this.data = a, this.name = "McpError";
  }
}
const Lo = 6e4;
class Mo {
  constructor(e) {
    this._options = e, this._requestMessageId = 0, this._requestHandlers = /* @__PURE__ */ new Map(), this._requestHandlerAbortControllers = /* @__PURE__ */ new Map(), this._notificationHandlers = /* @__PURE__ */ new Map(), this._responseHandlers = /* @__PURE__ */ new Map(), this._progressHandlers = /* @__PURE__ */ new Map(), this._timeoutInfo = /* @__PURE__ */ new Map(), this._pendingDebouncedNotifications = /* @__PURE__ */ new Set(), this.setNotificationHandler(ha, (t) => {
      const a = this._requestHandlerAbortControllers.get(t.params.requestId);
      a?.abort(t.params.reason);
    }), this.setNotificationHandler(ma, (t) => {
      this._onprogress(t);
    }), this.setRequestHandler(
      pa,
      // Automatic pong by default.
      (t) => ({})
    );
  }
  _setupTimeout(e, t, a, r, s = !1) {
    this._timeoutInfo.set(e, {
      timeoutId: setTimeout(r, t),
      startTime: Date.now(),
      timeout: t,
      maxTotalTimeout: a,
      resetTimeoutOnProgress: s,
      onTimeout: r
    });
  }
  _resetTimeout(e) {
    const t = this._timeoutInfo.get(e);
    if (!t)
      return !1;
    const a = Date.now() - t.startTime;
    if (t.maxTotalTimeout && a >= t.maxTotalTimeout)
      throw this._timeoutInfo.delete(e), new Oe(Ie.RequestTimeout, "Maximum total timeout exceeded", { maxTotalTimeout: t.maxTotalTimeout, totalElapsed: a });
    return clearTimeout(t.timeoutId), t.timeoutId = setTimeout(t.onTimeout, t.timeout), !0;
  }
  _cleanupTimeout(e) {
    const t = this._timeoutInfo.get(e);
    t && (clearTimeout(t.timeoutId), this._timeoutInfo.delete(e));
  }
  /**
   * Attaches to the given transport, starts it, and starts listening for messages.
   *
   * The Protocol object assumes ownership of the Transport, replacing any callbacks that have already been set, and expects that it is the only user of the Transport instance going forward.
   */
  async connect(e) {
    var t, a, r;
    this._transport = e;
    const s = (t = this.transport) === null || t === void 0 ? void 0 : t.onclose;
    this._transport.onclose = () => {
      s?.(), this._onclose();
    };
    const l = (a = this.transport) === null || a === void 0 ? void 0 : a.onerror;
    this._transport.onerror = (u) => {
      l?.(u), this._onerror(u);
    };
    const i = (r = this._transport) === null || r === void 0 ? void 0 : r.onmessage;
    this._transport.onmessage = (u, f) => {
      i?.(u, f), qa(u) || zi(u) ? this._onresponse(u) : Mi(u) ? this._onrequest(u, f) : Ui(u) ? this._onnotification(u) : this._onerror(new Error(`Unknown message type: ${JSON.stringify(u)}`));
    }, await this._transport.start();
  }
  _onclose() {
    var e;
    const t = this._responseHandlers;
    this._responseHandlers = /* @__PURE__ */ new Map(), this._progressHandlers.clear(), this._pendingDebouncedNotifications.clear(), this._transport = void 0, (e = this.onclose) === null || e === void 0 || e.call(this);
    const a = new Oe(Ie.ConnectionClosed, "Connection closed");
    for (const r of t.values())
      r(a);
  }
  _onerror(e) {
    var t;
    (t = this.onerror) === null || t === void 0 || t.call(this, e);
  }
  _onnotification(e) {
    var t;
    const a = (t = this._notificationHandlers.get(e.method)) !== null && t !== void 0 ? t : this.fallbackNotificationHandler;
    a !== void 0 && Promise.resolve().then(() => a(e)).catch((r) => this._onerror(new Error(`Uncaught error in notification handler: ${r}`)));
  }
  _onrequest(e, t) {
    var a, r, s, l;
    const i = (a = this._requestHandlers.get(e.method)) !== null && a !== void 0 ? a : this.fallbackRequestHandler;
    if (i === void 0) {
      (r = this._transport) === null || r === void 0 || r.send({
        jsonrpc: "2.0",
        id: e.id,
        error: {
          code: Ie.MethodNotFound,
          message: "Method not found"
        }
      }).catch((p) => this._onerror(new Error(`Failed to send an error response: ${p}`)));
      return;
    }
    const u = new AbortController();
    this._requestHandlerAbortControllers.set(e.id, u);
    const f = {
      signal: u.signal,
      sessionId: (s = this._transport) === null || s === void 0 ? void 0 : s.sessionId,
      _meta: (l = e.params) === null || l === void 0 ? void 0 : l._meta,
      sendNotification: (p) => this.notification(p, { relatedRequestId: e.id }),
      sendRequest: (p, m, b) => this.request(p, m, { ...b, relatedRequestId: e.id }),
      authInfo: t?.authInfo,
      requestId: e.id,
      requestInfo: t?.requestInfo
    };
    Promise.resolve().then(() => i(e, f)).then((p) => {
      var m;
      if (!u.signal.aborted)
        return (m = this._transport) === null || m === void 0 ? void 0 : m.send({
          result: p,
          jsonrpc: "2.0",
          id: e.id
        });
    }, (p) => {
      var m, b;
      if (!u.signal.aborted)
        return (m = this._transport) === null || m === void 0 ? void 0 : m.send({
          jsonrpc: "2.0",
          id: e.id,
          error: {
            code: Number.isSafeInteger(p.code) ? p.code : Ie.InternalError,
            message: (b = p.message) !== null && b !== void 0 ? b : "Internal error"
          }
        });
    }).catch((p) => this._onerror(new Error(`Failed to send response: ${p}`))).finally(() => {
      this._requestHandlerAbortControllers.delete(e.id);
    });
  }
  _onprogress(e) {
    const { progressToken: t, ...a } = e.params, r = Number(t), s = this._progressHandlers.get(r);
    if (!s) {
      this._onerror(new Error(`Received a progress notification for an unknown token: ${JSON.stringify(e)}`));
      return;
    }
    const l = this._responseHandlers.get(r), i = this._timeoutInfo.get(r);
    if (i && l && i.resetTimeoutOnProgress)
      try {
        this._resetTimeout(r);
      } catch (u) {
        l(u);
        return;
      }
    s(a);
  }
  _onresponse(e) {
    const t = Number(e.id), a = this._responseHandlers.get(t);
    if (a === void 0) {
      this._onerror(new Error(`Received a response for an unknown message ID: ${JSON.stringify(e)}`));
      return;
    }
    if (this._responseHandlers.delete(t), this._progressHandlers.delete(t), this._cleanupTimeout(t), qa(e))
      a(e);
    else {
      const r = new Oe(e.error.code, e.error.message, e.error.data);
      a(r);
    }
  }
  get transport() {
    return this._transport;
  }
  /**
   * Closes the connection.
   */
  async close() {
    var e;
    await ((e = this._transport) === null || e === void 0 ? void 0 : e.close());
  }
  /**
   * Sends a request and wait for a response.
   *
   * Do not use this method to emit notifications! Use notification() instead.
   */
  request(e, t, a) {
    const { relatedRequestId: r, resumptionToken: s, onresumptiontoken: l } = a ?? {};
    return new Promise((i, u) => {
      var f, p, m, b, c, h;
      if (!this._transport) {
        u(new Error("Not connected"));
        return;
      }
      ((f = this._options) === null || f === void 0 ? void 0 : f.enforceStrictCapabilities) === !0 && this.assertCapabilityForMethod(e.method), (p = a?.signal) === null || p === void 0 || p.throwIfAborted();
      const _ = this._requestMessageId++, g = {
        ...e,
        jsonrpc: "2.0",
        id: _
      };
      a?.onprogress && (this._progressHandlers.set(_, a.onprogress), g.params = {
        ...e.params,
        _meta: {
          ...((m = e.params) === null || m === void 0 ? void 0 : m._meta) || {},
          progressToken: _
        }
      });
      const E = (P) => {
        var x;
        this._responseHandlers.delete(_), this._progressHandlers.delete(_), this._cleanupTimeout(_), (x = this._transport) === null || x === void 0 || x.send({
          jsonrpc: "2.0",
          method: "notifications/cancelled",
          params: {
            requestId: _,
            reason: String(P)
          }
        }, { relatedRequestId: r, resumptionToken: s, onresumptiontoken: l }).catch(($) => this._onerror(new Error(`Failed to send cancellation: ${$}`))), u(P);
      };
      this._responseHandlers.set(_, (P) => {
        var x;
        if (!(!((x = a?.signal) === null || x === void 0) && x.aborted)) {
          if (P instanceof Error)
            return u(P);
          try {
            const $ = t.parse(P.result);
            i($);
          } catch ($) {
            u($);
          }
        }
      }), (b = a?.signal) === null || b === void 0 || b.addEventListener("abort", () => {
        var P;
        E((P = a?.signal) === null || P === void 0 ? void 0 : P.reason);
      });
      const j = (c = a?.timeout) !== null && c !== void 0 ? c : Lo, T = () => E(new Oe(Ie.RequestTimeout, "Request timed out", { timeout: j }));
      this._setupTimeout(_, j, a?.maxTotalTimeout, T, (h = a?.resetTimeoutOnProgress) !== null && h !== void 0 ? h : !1), this._transport.send(g, { relatedRequestId: r, resumptionToken: s, onresumptiontoken: l }).catch((P) => {
        this._cleanupTimeout(_), u(P);
      });
    });
  }
  /**
   * Emits a notification, which is a one-way message that does not expect a response.
   */
  async notification(e, t) {
    var a, r;
    if (!this._transport)
      throw new Error("Not connected");
    if (this.assertNotificationCapability(e.method), ((r = (a = this._options) === null || a === void 0 ? void 0 : a.debouncedNotificationMethods) !== null && r !== void 0 ? r : []).includes(e.method) && !e.params && !t?.relatedRequestId) {
      if (this._pendingDebouncedNotifications.has(e.method))
        return;
      this._pendingDebouncedNotifications.add(e.method), Promise.resolve().then(() => {
        var u;
        if (this._pendingDebouncedNotifications.delete(e.method), !this._transport)
          return;
        const f = {
          ...e,
          jsonrpc: "2.0"
        };
        (u = this._transport) === null || u === void 0 || u.send(f, t).catch((p) => this._onerror(p));
      });
      return;
    }
    const i = {
      ...e,
      jsonrpc: "2.0"
    };
    await this._transport.send(i, t);
  }
  /**
   * Registers a handler to invoke when this protocol object receives a request with the given method.
   *
   * Note that this will replace any previous request handler for the same method.
   */
  setRequestHandler(e, t) {
    const a = e.shape.method.value;
    this.assertRequestHandlerCapability(a), this._requestHandlers.set(a, (r, s) => Promise.resolve(t(e.parse(r), s)));
  }
  /**
   * Removes the request handler for the given method.
   */
  removeRequestHandler(e) {
    this._requestHandlers.delete(e);
  }
  /**
   * Asserts that a request handler has not already been set for the given method, in preparation for a new one being automatically installed.
   */
  assertCanSetRequestHandler(e) {
    if (this._requestHandlers.has(e))
      throw new Error(`A request handler for ${e} already exists, which would be overridden`);
  }
  /**
   * Registers a handler to invoke when this protocol object receives a notification with the given method.
   *
   * Note that this will replace any previous notification handler for the same method.
   */
  setNotificationHandler(e, t) {
    this._notificationHandlers.set(e.shape.method.value, (a) => Promise.resolve(t(e.parse(a))));
  }
  /**
   * Removes the notification handler for the given method.
   */
  removeNotificationHandler(e) {
    this._notificationHandlers.delete(e);
  }
}
function Uo(n, e) {
  return Object.entries(e).reduce((t, [a, r]) => (r && typeof r == "object" ? t[a] = t[a] ? { ...t[a], ...r } : r : t[a] = r, t), { ...n });
}
function zo(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var kr = { exports: {} };
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
var Zo = kr.exports, La;
function Vo() {
  return La || (La = 1, function(n, e) {
    (function(t, a) {
      a(e);
    })(Zo, function(t) {
      function a() {
        for (var v = arguments.length, d = Array(v), y = 0; y < v; y++)
          d[y] = arguments[y];
        if (d.length > 1) {
          d[0] = d[0].slice(0, -1);
          for (var O = d.length - 1, I = 1; I < O; ++I)
            d[I] = d[I].slice(1, -1);
          return d[O] = d[O].slice(1), d.join("");
        } else
          return d[0];
      }
      function r(v) {
        return "(?:" + v + ")";
      }
      function s(v) {
        return v === void 0 ? "undefined" : v === null ? "null" : Object.prototype.toString.call(v).split(" ").pop().split("]").shift().toLowerCase();
      }
      function l(v) {
        return v.toUpperCase();
      }
      function i(v) {
        return v != null ? v instanceof Array ? v : typeof v.length != "number" || v.split || v.setInterval || v.call ? [v] : Array.prototype.slice.call(v) : [];
      }
      function u(v, d) {
        var y = v;
        if (d)
          for (var O in d)
            y[O] = d[O];
        return y;
      }
      function f(v) {
        var d = "[A-Za-z]", y = "[0-9]", O = a(y, "[A-Fa-f]"), I = r(r("%[EFef]" + O + "%" + O + O + "%" + O + O) + "|" + r("%[89A-Fa-f]" + O + "%" + O + O) + "|" + r("%" + O + O)), B = "[\\:\\/\\?\\#\\[\\]\\@]", K = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", ce = a(B, K), me = v ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", we = v ? "[\\uE000-\\uF8FF]" : "[]", ue = a(d, y, "[\\-\\.\\_\\~]", me);
        r(d + a(d, y, "[\\+\\-\\.]") + "*"), r(r(I + "|" + a(ue, K, "[\\:]")) + "*");
        var pe = r(r("25[0-5]") + "|" + r("2[0-4]" + y) + "|" + r("1" + y + y) + "|" + r("0?[1-9]" + y) + "|0?0?" + y), xe = r(pe + "\\." + pe + "\\." + pe + "\\." + pe), re = r(O + "{1,4}"), ge = r(r(re + "\\:" + re) + "|" + xe), Re = r(r(re + "\\:") + "{6}" + ge), ye = r("\\:\\:" + r(re + "\\:") + "{5}" + ge), ir = r(r(re) + "?\\:\\:" + r(re + "\\:") + "{4}" + ge), Ke = r(r(r(re + "\\:") + "{0,1}" + re) + "?\\:\\:" + r(re + "\\:") + "{3}" + ge), Qe = r(r(r(re + "\\:") + "{0,2}" + re) + "?\\:\\:" + r(re + "\\:") + "{2}" + ge), yr = r(r(r(re + "\\:") + "{0,3}" + re) + "?\\:\\:" + re + "\\:" + ge), dr = r(r(r(re + "\\:") + "{0,4}" + re) + "?\\:\\:" + ge), Me = r(r(r(re + "\\:") + "{0,5}" + re) + "?\\:\\:" + re), We = r(r(r(re + "\\:") + "{0,6}" + re) + "?\\:\\:"), fr = r([Re, ye, ir, Ke, Qe, yr, dr, Me, We].join("|")), tr = r(r(ue + "|" + I) + "+");
        r("[vV]" + O + "+\\." + a(ue, K, "[\\:]") + "+"), r(r(I + "|" + a(ue, K)) + "*");
        var Or = r(I + "|" + a(ue, K, "[\\:\\@]"));
        return r(r(I + "|" + a(ue, K, "[\\@]")) + "+"), r(r(Or + "|" + a("[\\/\\?]", we)) + "*"), {
          NOT_SCHEME: new RegExp(a("[^]", d, y, "[\\+\\-\\.]"), "g"),
          NOT_USERINFO: new RegExp(a("[^\\%\\:]", ue, K), "g"),
          NOT_HOST: new RegExp(a("[^\\%\\[\\]\\:]", ue, K), "g"),
          NOT_PATH: new RegExp(a("[^\\%\\/\\:\\@]", ue, K), "g"),
          NOT_PATH_NOSCHEME: new RegExp(a("[^\\%\\/\\@]", ue, K), "g"),
          NOT_QUERY: new RegExp(a("[^\\%]", ue, K, "[\\:\\@\\/\\?]", we), "g"),
          NOT_FRAGMENT: new RegExp(a("[^\\%]", ue, K, "[\\:\\@\\/\\?]"), "g"),
          ESCAPE: new RegExp(a("[^]", ue, K), "g"),
          UNRESERVED: new RegExp(ue, "g"),
          OTHER_CHARS: new RegExp(a("[^\\%]", ue, ce), "g"),
          PCT_ENCODED: new RegExp(I, "g"),
          IPV4ADDRESS: new RegExp("^(" + xe + ")$"),
          IPV6ADDRESS: new RegExp("^\\[?(" + fr + ")" + r(r("\\%25|\\%(?!" + O + "{2})") + "(" + tr + ")") + "?\\]?$")
          //RFC 6874, with relaxed parsing rules
        };
      }
      var p = f(!1), m = f(!0), b = /* @__PURE__ */ function() {
        function v(d, y) {
          var O = [], I = !0, B = !1, K = void 0;
          try {
            for (var ce = d[Symbol.iterator](), me; !(I = (me = ce.next()).done) && (O.push(me.value), !(y && O.length === y)); I = !0)
              ;
          } catch (we) {
            B = !0, K = we;
          } finally {
            try {
              !I && ce.return && ce.return();
            } finally {
              if (B) throw K;
            }
          }
          return O;
        }
        return function(d, y) {
          if (Array.isArray(d))
            return d;
          if (Symbol.iterator in Object(d))
            return v(d, y);
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        };
      }(), c = function(v) {
        if (Array.isArray(v)) {
          for (var d = 0, y = Array(v.length); d < v.length; d++) y[d] = v[d];
          return y;
        } else
          return Array.from(v);
      }, h = 2147483647, _ = 36, g = 1, E = 26, j = 38, T = 700, P = 72, x = 128, $ = "-", A = /^xn--/, k = /[^\0-\x7E]/, C = /[\x2E\u3002\uFF0E\uFF61]/g, S = {
        overflow: "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      }, R = _ - g, D = Math.floor, L = String.fromCharCode;
      function M(v) {
        throw new RangeError(S[v]);
      }
      function J(v, d) {
        for (var y = [], O = v.length; O--; )
          y[O] = d(v[O]);
        return y;
      }
      function te(v, d) {
        var y = v.split("@"), O = "";
        y.length > 1 && (O = y[0] + "@", v = y[1]), v = v.replace(C, ".");
        var I = v.split("."), B = J(I, d).join(".");
        return O + B;
      }
      function Q(v) {
        for (var d = [], y = 0, O = v.length; y < O; ) {
          var I = v.charCodeAt(y++);
          if (I >= 55296 && I <= 56319 && y < O) {
            var B = v.charCodeAt(y++);
            (B & 64512) == 56320 ? d.push(((I & 1023) << 10) + (B & 1023) + 65536) : (d.push(I), y--);
          } else
            d.push(I);
        }
        return d;
      }
      var ie = function(d) {
        return String.fromCodePoint.apply(String, c(d));
      }, X = function(d) {
        return d - 48 < 10 ? d - 22 : d - 65 < 26 ? d - 65 : d - 97 < 26 ? d - 97 : _;
      }, ee = function(d, y) {
        return d + 22 + 75 * (d < 26) - ((y != 0) << 5);
      }, Ce = function(d, y, O) {
        var I = 0;
        for (
          d = O ? D(d / T) : d >> 1, d += D(d / y);
          /* no initialization */
          d > R * E >> 1;
          I += _
        )
          d = D(d / R);
        return D(I + (R + 1) * d / (d + j));
      }, Te = function(d) {
        var y = [], O = d.length, I = 0, B = x, K = P, ce = d.lastIndexOf($);
        ce < 0 && (ce = 0);
        for (var me = 0; me < ce; ++me)
          d.charCodeAt(me) >= 128 && M("not-basic"), y.push(d.charCodeAt(me));
        for (var we = ce > 0 ? ce + 1 : 0; we < O; ) {
          for (
            var ue = I, pe = 1, xe = _;
            ;
            /* no condition */
            xe += _
          ) {
            we >= O && M("invalid-input");
            var re = X(d.charCodeAt(we++));
            (re >= _ || re > D((h - I) / pe)) && M("overflow"), I += re * pe;
            var ge = xe <= K ? g : xe >= K + E ? E : xe - K;
            if (re < ge)
              break;
            var Re = _ - ge;
            pe > D(h / Re) && M("overflow"), pe *= Re;
          }
          var ye = y.length + 1;
          K = Ce(I - ue, ye, ue == 0), D(I / ye) > h - B && M("overflow"), B += D(I / ye), I %= ye, y.splice(I++, 0, B);
        }
        return String.fromCodePoint.apply(String, y);
      }, $e = function(d) {
        var y = [];
        d = Q(d);
        var O = d.length, I = x, B = 0, K = P, ce = !0, me = !1, we = void 0;
        try {
          for (var ue = d[Symbol.iterator](), pe; !(ce = (pe = ue.next()).done); ce = !0) {
            var xe = pe.value;
            xe < 128 && y.push(L(xe));
          }
        } catch ($r) {
          me = !0, we = $r;
        } finally {
          try {
            !ce && ue.return && ue.return();
          } finally {
            if (me)
              throw we;
          }
        }
        var re = y.length, ge = re;
        for (re && y.push($); ge < O; ) {
          var Re = h, ye = !0, ir = !1, Ke = void 0;
          try {
            for (var Qe = d[Symbol.iterator](), yr; !(ye = (yr = Qe.next()).done); ye = !0) {
              var dr = yr.value;
              dr >= I && dr < Re && (Re = dr);
            }
          } catch ($r) {
            ir = !0, Ke = $r;
          } finally {
            try {
              !ye && Qe.return && Qe.return();
            } finally {
              if (ir)
                throw Ke;
            }
          }
          var Me = ge + 1;
          Re - I > D((h - B) / Me) && M("overflow"), B += (Re - I) * Me, I = Re;
          var We = !0, fr = !1, tr = void 0;
          try {
            for (var Or = d[Symbol.iterator](), Ta; !(We = (Ta = Or.next()).done); We = !0) {
              var Aa = Ta.value;
              if (Aa < I && ++B > h && M("overflow"), Aa == I) {
                for (
                  var Wr = B, Gr = _;
                  ;
                  /* no condition */
                  Gr += _
                ) {
                  var Yr = Gr <= K ? g : Gr >= K + E ? E : Gr - K;
                  if (Wr < Yr)
                    break;
                  var ka = Wr - Yr, Ca = _ - Yr;
                  y.push(L(ee(Yr + ka % Ca, 0))), Wr = D(ka / Ca);
                }
                y.push(L(ee(Wr, 0))), K = Ce(B, Me, ge == re), B = 0, ++ge;
              }
            }
          } catch ($r) {
            fr = !0, tr = $r;
          } finally {
            try {
              !We && Or.return && Or.return();
            } finally {
              if (fr)
                throw tr;
            }
          }
          ++B, ++I;
        }
        return y.join("");
      }, Ee = function(d) {
        return te(d, function(y) {
          return A.test(y) ? Te(y.slice(4).toLowerCase()) : y;
        });
      }, Le = function(d) {
        return te(d, function(y) {
          return k.test(y) ? "xn--" + $e(y) : y;
        });
      }, w = {
        /**
         * A string representing the current Punycode.js version number.
         * @memberOf punycode
         * @type String
         */
        version: "2.1.0",
        /**
         * An object of methods to convert from JavaScript's internal character
         * representation (UCS-2) to Unicode code points, and back.
         * @see <https://mathiasbynens.be/notes/javascript-encoding>
         * @memberOf punycode
         * @type Object
         */
        ucs2: {
          decode: Q,
          encode: ie
        },
        decode: Te,
        encode: $e,
        toASCII: Le,
        toUnicode: Ee
      }, N = {};
      function Z(v) {
        var d = v.charCodeAt(0), y = void 0;
        return d < 16 ? y = "%0" + d.toString(16).toUpperCase() : d < 128 ? y = "%" + d.toString(16).toUpperCase() : d < 2048 ? y = "%" + (d >> 6 | 192).toString(16).toUpperCase() + "%" + (d & 63 | 128).toString(16).toUpperCase() : y = "%" + (d >> 12 | 224).toString(16).toUpperCase() + "%" + (d >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (d & 63 | 128).toString(16).toUpperCase(), y;
      }
      function Y(v) {
        for (var d = "", y = 0, O = v.length; y < O; ) {
          var I = parseInt(v.substr(y + 1, 2), 16);
          if (I < 128)
            d += String.fromCharCode(I), y += 3;
          else if (I >= 194 && I < 224) {
            if (O - y >= 6) {
              var B = parseInt(v.substr(y + 4, 2), 16);
              d += String.fromCharCode((I & 31) << 6 | B & 63);
            } else
              d += v.substr(y, 6);
            y += 6;
          } else if (I >= 224) {
            if (O - y >= 9) {
              var K = parseInt(v.substr(y + 4, 2), 16), ce = parseInt(v.substr(y + 7, 2), 16);
              d += String.fromCharCode((I & 15) << 12 | (K & 63) << 6 | ce & 63);
            } else
              d += v.substr(y, 9);
            y += 9;
          } else
            d += v.substr(y, 3), y += 3;
        }
        return d;
      }
      function F(v, d) {
        function y(O) {
          var I = Y(O);
          return I.match(d.UNRESERVED) ? I : O;
        }
        return v.scheme && (v.scheme = String(v.scheme).replace(d.PCT_ENCODED, y).toLowerCase().replace(d.NOT_SCHEME, "")), v.userinfo !== void 0 && (v.userinfo = String(v.userinfo).replace(d.PCT_ENCODED, y).replace(d.NOT_USERINFO, Z).replace(d.PCT_ENCODED, l)), v.host !== void 0 && (v.host = String(v.host).replace(d.PCT_ENCODED, y).toLowerCase().replace(d.NOT_HOST, Z).replace(d.PCT_ENCODED, l)), v.path !== void 0 && (v.path = String(v.path).replace(d.PCT_ENCODED, y).replace(v.scheme ? d.NOT_PATH : d.NOT_PATH_NOSCHEME, Z).replace(d.PCT_ENCODED, l)), v.query !== void 0 && (v.query = String(v.query).replace(d.PCT_ENCODED, y).replace(d.NOT_QUERY, Z).replace(d.PCT_ENCODED, l)), v.fragment !== void 0 && (v.fragment = String(v.fragment).replace(d.PCT_ENCODED, y).replace(d.NOT_FRAGMENT, Z).replace(d.PCT_ENCODED, l)), v;
      }
      function U(v) {
        return v.replace(/^0*(.*)/, "$1") || "0";
      }
      function se(v, d) {
        var y = v.match(d.IPV4ADDRESS) || [], O = b(y, 2), I = O[1];
        return I ? I.split(".").map(U).join(".") : v;
      }
      function le(v, d) {
        var y = v.match(d.IPV6ADDRESS) || [], O = b(y, 3), I = O[1], B = O[2];
        if (I) {
          for (var K = I.toLowerCase().split("::").reverse(), ce = b(K, 2), me = ce[0], we = ce[1], ue = we ? we.split(":").map(U) : [], pe = me.split(":").map(U), xe = d.IPV4ADDRESS.test(pe[pe.length - 1]), re = xe ? 7 : 8, ge = pe.length - re, Re = Array(re), ye = 0; ye < re; ++ye)
            Re[ye] = ue[ye] || pe[ge + ye] || "";
          xe && (Re[re - 1] = se(Re[re - 1], d));
          var ir = Re.reduce(function(Me, We, fr) {
            if (!We || We === "0") {
              var tr = Me[Me.length - 1];
              tr && tr.index + tr.length === fr ? tr.length++ : Me.push({ index: fr, length: 1 });
            }
            return Me;
          }, []), Ke = ir.sort(function(Me, We) {
            return We.length - Me.length;
          })[0], Qe = void 0;
          if (Ke && Ke.length > 1) {
            var yr = Re.slice(0, Ke.index), dr = Re.slice(Ke.index + Ke.length);
            Qe = yr.join(":") + "::" + dr.join(":");
          } else
            Qe = Re.join(":");
          return B && (Qe += "%" + B), Qe;
        } else
          return v;
      }
      var oe = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i, ve = "".match(/(){0}/)[1] === void 0;
      function fe(v) {
        var d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, y = {}, O = d.iri !== !1 ? m : p;
        d.reference === "suffix" && (v = (d.scheme ? d.scheme + ":" : "") + "//" + v);
        var I = v.match(oe);
        if (I) {
          ve ? (y.scheme = I[1], y.userinfo = I[3], y.host = I[4], y.port = parseInt(I[5], 10), y.path = I[6] || "", y.query = I[7], y.fragment = I[8], isNaN(y.port) && (y.port = I[5])) : (y.scheme = I[1] || void 0, y.userinfo = v.indexOf("@") !== -1 ? I[3] : void 0, y.host = v.indexOf("//") !== -1 ? I[4] : void 0, y.port = parseInt(I[5], 10), y.path = I[6] || "", y.query = v.indexOf("?") !== -1 ? I[7] : void 0, y.fragment = v.indexOf("#") !== -1 ? I[8] : void 0, isNaN(y.port) && (y.port = v.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? I[4] : void 0)), y.host && (y.host = le(se(y.host, O), O)), y.scheme === void 0 && y.userinfo === void 0 && y.host === void 0 && y.port === void 0 && !y.path && y.query === void 0 ? y.reference = "same-document" : y.scheme === void 0 ? y.reference = "relative" : y.fragment === void 0 ? y.reference = "absolute" : y.reference = "uri", d.reference && d.reference !== "suffix" && d.reference !== y.reference && (y.error = y.error || "URI is not a " + d.reference + " reference.");
          var B = N[(d.scheme || y.scheme || "").toLowerCase()];
          if (!d.unicodeSupport && (!B || !B.unicodeSupport)) {
            if (y.host && (d.domainHost || B && B.domainHost))
              try {
                y.host = w.toASCII(y.host.replace(O.PCT_ENCODED, Y).toLowerCase());
              } catch (K) {
                y.error = y.error || "Host's domain name can not be converted to ASCII via punycode: " + K;
              }
            F(y, p);
          } else
            F(y, O);
          B && B.parse && B.parse(y, d);
        } else
          y.error = y.error || "URI can not be parsed.";
        return y;
      }
      function he(v, d) {
        var y = d.iri !== !1 ? m : p, O = [];
        return v.userinfo !== void 0 && (O.push(v.userinfo), O.push("@")), v.host !== void 0 && O.push(le(se(String(v.host), y), y).replace(y.IPV6ADDRESS, function(I, B, K) {
          return "[" + B + (K ? "%25" + K : "") + "]";
        })), (typeof v.port == "number" || typeof v.port == "string") && (O.push(":"), O.push(String(v.port))), O.length ? O.join("") : void 0;
      }
      var Ae = /^\.\.?\//, _e = /^\/\.(\/|$)/, Ze = /^\/\.\.(\/|$)/, je = /^\/?(?:.|\n)*?(?=\/|$)/;
      function Pe(v) {
        for (var d = []; v.length; )
          if (v.match(Ae))
            v = v.replace(Ae, "");
          else if (v.match(_e))
            v = v.replace(_e, "/");
          else if (v.match(Ze))
            v = v.replace(Ze, "/"), d.pop();
          else if (v === "." || v === "..")
            v = "";
          else {
            var y = v.match(je);
            if (y) {
              var O = y[0];
              v = v.slice(O.length), d.push(O);
            } else
              throw new Error("Unexpected dot segment condition");
          }
        return d.join("");
      }
      function Se(v) {
        var d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, y = d.iri ? m : p, O = [], I = N[(d.scheme || v.scheme || "").toLowerCase()];
        if (I && I.serialize && I.serialize(v, d), v.host && !y.IPV6ADDRESS.test(v.host)) {
          if (d.domainHost || I && I.domainHost)
            try {
              v.host = d.iri ? w.toUnicode(v.host) : w.toASCII(v.host.replace(y.PCT_ENCODED, Y).toLowerCase());
            } catch (ce) {
              v.error = v.error || "Host's domain name can not be converted to " + (d.iri ? "Unicode" : "ASCII") + " via punycode: " + ce;
            }
        }
        F(v, y), d.reference !== "suffix" && v.scheme && (O.push(v.scheme), O.push(":"));
        var B = he(v, d);
        if (B !== void 0 && (d.reference !== "suffix" && O.push("//"), O.push(B), v.path && v.path.charAt(0) !== "/" && O.push("/")), v.path !== void 0) {
          var K = v.path;
          !d.absolutePath && (!I || !I.absolutePath) && (K = Pe(K)), B === void 0 && (K = K.replace(/^\/\//, "/%2F")), O.push(K);
        }
        return v.query !== void 0 && (O.push("?"), O.push(v.query)), v.fragment !== void 0 && (O.push("#"), O.push(v.fragment)), O.join("");
      }
      function Ne(v, d) {
        var y = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, O = arguments[3], I = {};
        return O || (v = fe(Se(v, y), y), d = fe(Se(d, y), y)), y = y || {}, !y.tolerant && d.scheme ? (I.scheme = d.scheme, I.userinfo = d.userinfo, I.host = d.host, I.port = d.port, I.path = Pe(d.path || ""), I.query = d.query) : (d.userinfo !== void 0 || d.host !== void 0 || d.port !== void 0 ? (I.userinfo = d.userinfo, I.host = d.host, I.port = d.port, I.path = Pe(d.path || ""), I.query = d.query) : (d.path ? (d.path.charAt(0) === "/" ? I.path = Pe(d.path) : ((v.userinfo !== void 0 || v.host !== void 0 || v.port !== void 0) && !v.path ? I.path = "/" + d.path : v.path ? I.path = v.path.slice(0, v.path.lastIndexOf("/") + 1) + d.path : I.path = d.path, I.path = Pe(I.path)), I.query = d.query) : (I.path = v.path, d.query !== void 0 ? I.query = d.query : I.query = v.query), I.userinfo = v.userinfo, I.host = v.host, I.port = v.port), I.scheme = v.scheme), I.fragment = d.fragment, I;
      }
      function Qr(v, d, y) {
        var O = u({ scheme: "null" }, y);
        return Se(Ne(fe(v, O), fe(d, O), O, !0), O);
      }
      function dt(v, d) {
        return typeof v == "string" ? v = Se(fe(v, d), d) : s(v) === "object" && (v = fe(Se(v, d), d)), v;
      }
      function ft(v, d, y) {
        return typeof v == "string" ? v = Se(fe(v, y), y) : s(v) === "object" && (v = Se(v, y)), typeof d == "string" ? d = Se(fe(d, y), y) : s(d) === "object" && (d = Se(d, y)), v === d;
      }
      function yn(v, d) {
        return v && v.toString().replace(!d || !d.iri ? p.ESCAPE : m.ESCAPE, Z);
      }
      function rr(v, d) {
        return v && v.toString().replace(!d || !d.iri ? p.PCT_ENCODED : m.PCT_ENCODED, Y);
      }
      var Rr = {
        scheme: "http",
        domainHost: !0,
        parse: function(d, y) {
          return d.host || (d.error = d.error || "HTTP URIs must have a host."), d;
        },
        serialize: function(d, y) {
          var O = String(d.scheme).toLowerCase() === "https";
          return (d.port === (O ? 443 : 80) || d.port === "") && (d.port = void 0), d.path || (d.path = "/"), d;
        }
      }, Ea = {
        scheme: "https",
        domainHost: Rr.domainHost,
        parse: Rr.parse,
        serialize: Rr.serialize
      };
      function Sa(v) {
        return typeof v.secure == "boolean" ? v.secure : String(v.scheme).toLowerCase() === "wss";
      }
      var Ir = {
        scheme: "ws",
        domainHost: !0,
        parse: function(d, y) {
          var O = d;
          return O.secure = Sa(O), O.resourceName = (O.path || "/") + (O.query ? "?" + O.query : ""), O.path = void 0, O.query = void 0, O;
        },
        serialize: function(d, y) {
          if ((d.port === (Sa(d) ? 443 : 80) || d.port === "") && (d.port = void 0), typeof d.secure == "boolean" && (d.scheme = d.secure ? "wss" : "ws", d.secure = void 0), d.resourceName) {
            var O = d.resourceName.split("?"), I = b(O, 2), B = I[0], K = I[1];
            d.path = B && B !== "/" ? B : void 0, d.query = K, d.resourceName = void 0;
          }
          return d.fragment = void 0, d;
        }
      }, wa = {
        scheme: "wss",
        domainHost: Ir.domainHost,
        parse: Ir.parse,
        serialize: Ir.serialize
      }, _n = {}, xa = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]", Be = "[0-9A-Fa-f]", bn = r(r("%[EFef]" + Be + "%" + Be + Be + "%" + Be + Be) + "|" + r("%[89A-Fa-f]" + Be + "%" + Be + Be) + "|" + r("%" + Be + Be)), Pn = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", En = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", Sn = a(En, '[\\"\\\\]'), wn = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]", xn = new RegExp(xa, "g"), gr = new RegExp(bn, "g"), Rn = new RegExp(a("[^]", Pn, "[\\.]", '[\\"]', Sn), "g"), Ra = new RegExp(a("[^]", xa, wn), "g"), In = Ra;
      function ht(v) {
        var d = Y(v);
        return d.match(xn) ? d : v;
      }
      var Ia = {
        scheme: "mailto",
        parse: function(d, y) {
          var O = d, I = O.to = O.path ? O.path.split(",") : [];
          if (O.path = void 0, O.query) {
            for (var B = !1, K = {}, ce = O.query.split("&"), me = 0, we = ce.length; me < we; ++me) {
              var ue = ce[me].split("=");
              switch (ue[0]) {
                case "to":
                  for (var pe = ue[1].split(","), xe = 0, re = pe.length; xe < re; ++xe)
                    I.push(pe[xe]);
                  break;
                case "subject":
                  O.subject = rr(ue[1], y);
                  break;
                case "body":
                  O.body = rr(ue[1], y);
                  break;
                default:
                  B = !0, K[rr(ue[0], y)] = rr(ue[1], y);
                  break;
              }
            }
            B && (O.headers = K);
          }
          O.query = void 0;
          for (var ge = 0, Re = I.length; ge < Re; ++ge) {
            var ye = I[ge].split("@");
            if (ye[0] = rr(ye[0]), y.unicodeSupport)
              ye[1] = rr(ye[1], y).toLowerCase();
            else
              try {
                ye[1] = w.toASCII(rr(ye[1], y).toLowerCase());
              } catch (ir) {
                O.error = O.error || "Email address's domain name can not be converted to ASCII via punycode: " + ir;
              }
            I[ge] = ye.join("@");
          }
          return O;
        },
        serialize: function(d, y) {
          var O = d, I = i(d.to);
          if (I) {
            for (var B = 0, K = I.length; B < K; ++B) {
              var ce = String(I[B]), me = ce.lastIndexOf("@"), we = ce.slice(0, me).replace(gr, ht).replace(gr, l).replace(Rn, Z), ue = ce.slice(me + 1);
              try {
                ue = y.iri ? w.toUnicode(ue) : w.toASCII(rr(ue, y).toLowerCase());
              } catch (ge) {
                O.error = O.error || "Email address's domain name can not be converted to " + (y.iri ? "Unicode" : "ASCII") + " via punycode: " + ge;
              }
              I[B] = we + "@" + ue;
            }
            O.path = I.join(",");
          }
          var pe = d.headers = d.headers || {};
          d.subject && (pe.subject = d.subject), d.body && (pe.body = d.body);
          var xe = [];
          for (var re in pe)
            pe[re] !== _n[re] && xe.push(re.replace(gr, ht).replace(gr, l).replace(Ra, Z) + "=" + pe[re].replace(gr, ht).replace(gr, l).replace(In, Z));
          return xe.length && (O.query = xe.join("&")), O;
        }
      }, On = /^([^\:]+)\:(.*)/, Oa = {
        scheme: "urn",
        parse: function(d, y) {
          var O = d.path && d.path.match(On), I = d;
          if (O) {
            var B = y.scheme || I.scheme || "urn", K = O[1].toLowerCase(), ce = O[2], me = B + ":" + (y.nid || K), we = N[me];
            I.nid = K, I.nss = ce, I.path = void 0, we && (I = we.parse(I, y));
          } else
            I.error = I.error || "URN can not be parsed.";
          return I;
        },
        serialize: function(d, y) {
          var O = y.scheme || d.scheme || "urn", I = d.nid, B = O + ":" + (y.nid || I), K = N[B];
          K && (d = K.serialize(d, y));
          var ce = d, me = d.nss;
          return ce.path = (I || y.nid) + ":" + me, ce;
        }
      }, $n = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/, $a = {
        scheme: "urn:uuid",
        parse: function(d, y) {
          var O = d;
          return O.uuid = O.nss, O.nss = void 0, !y.tolerant && (!O.uuid || !O.uuid.match($n)) && (O.error = O.error || "UUID is not valid."), O;
        },
        serialize: function(d, y) {
          var O = d;
          return O.nss = (d.uuid || "").toLowerCase(), O;
        }
      };
      N[Rr.scheme] = Rr, N[Ea.scheme] = Ea, N[Ir.scheme] = Ir, N[wa.scheme] = wa, N[Ia.scheme] = Ia, N[Oa.scheme] = Oa, N[$a.scheme] = $a, t.SCHEMES = N, t.pctEncChar = Z, t.pctDecChars = Y, t.parse = fe, t.removeDotSegments = Pe, t.serialize = Se, t.resolveComponents = Ne, t.resolve = Qr, t.normalize = dt, t.equal = ft, t.escapeComponent = yn, t.unescapeComponent = rr, Object.defineProperty(t, "__esModule", { value: !0 });
    });
  }(kr, kr.exports)), kr.exports;
}
var mt, Ma;
function _a() {
  return Ma || (Ma = 1, mt = function n(e, t) {
    if (e === t) return !0;
    if (e && t && typeof e == "object" && typeof t == "object") {
      if (e.constructor !== t.constructor) return !1;
      var a, r, s;
      if (Array.isArray(e)) {
        if (a = e.length, a != t.length) return !1;
        for (r = a; r-- !== 0; )
          if (!n(e[r], t[r])) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
      if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf();
      if (e.toString !== Object.prototype.toString) return e.toString() === t.toString();
      if (s = Object.keys(e), a = s.length, a !== Object.keys(t).length) return !1;
      for (r = a; r-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(t, s[r])) return !1;
      for (r = a; r-- !== 0; ) {
        var l = s[r];
        if (!n(e[l], t[l])) return !1;
      }
      return !0;
    }
    return e !== e && t !== t;
  }), mt;
}
var vt, Ua;
function Ho() {
  return Ua || (Ua = 1, vt = function(e) {
    for (var t = 0, a = e.length, r = 0, s; r < a; )
      t++, s = e.charCodeAt(r++), s >= 55296 && s <= 56319 && r < a && (s = e.charCodeAt(r), (s & 64512) == 56320 && r++);
    return t;
  }), vt;
}
var gt, za;
function xr() {
  if (za) return gt;
  za = 1, gt = {
    copy: n,
    checkDataType: e,
    checkDataTypes: t,
    coerceToTypes: r,
    toHash: s,
    getProperty: u,
    escapeQuotes: f,
    equal: _a(),
    ucs2length: Ho(),
    varOccurences: p,
    varReplace: m,
    schemaHasRules: b,
    schemaHasRulesExcept: c,
    schemaUnknownRules: h,
    toQuotedString: _,
    getPathExpr: g,
    getPath: E,
    getData: P,
    unescapeFragment: $,
    unescapeJsonPointer: C,
    escapeFragment: A,
    escapeJsonPointer: k
  };
  function n(S, R) {
    R = R || {};
    for (var D in S) R[D] = S[D];
    return R;
  }
  function e(S, R, D, L) {
    var M = L ? " !== " : " === ", J = L ? " || " : " && ", te = L ? "!" : "", Q = L ? "" : "!";
    switch (S) {
      case "null":
        return R + M + "null";
      case "array":
        return te + "Array.isArray(" + R + ")";
      case "object":
        return "(" + te + R + J + "typeof " + R + M + '"object"' + J + Q + "Array.isArray(" + R + "))";
      case "integer":
        return "(typeof " + R + M + '"number"' + J + Q + "(" + R + " % 1)" + J + R + M + R + (D ? J + te + "isFinite(" + R + ")" : "") + ")";
      case "number":
        return "(typeof " + R + M + '"' + S + '"' + (D ? J + te + "isFinite(" + R + ")" : "") + ")";
      default:
        return "typeof " + R + M + '"' + S + '"';
    }
  }
  function t(S, R, D) {
    switch (S.length) {
      case 1:
        return e(S[0], R, D, !0);
      default:
        var L = "", M = s(S);
        M.array && M.object && (L = M.null ? "(" : "(!" + R + " || ", L += "typeof " + R + ' !== "object")', delete M.null, delete M.array, delete M.object), M.number && delete M.integer;
        for (var J in M)
          L += (L ? " && " : "") + e(J, R, D, !0);
        return L;
    }
  }
  var a = s(["string", "number", "integer", "boolean", "null"]);
  function r(S, R) {
    if (Array.isArray(R)) {
      for (var D = [], L = 0; L < R.length; L++) {
        var M = R[L];
        (a[M] || S === "array" && M === "array") && (D[D.length] = M);
      }
      if (D.length) return D;
    } else {
      if (a[R])
        return [R];
      if (S === "array" && R === "array")
        return ["array"];
    }
  }
  function s(S) {
    for (var R = {}, D = 0; D < S.length; D++) R[S[D]] = !0;
    return R;
  }
  var l = /^[a-z$_][a-z$_0-9]*$/i, i = /'|\\/g;
  function u(S) {
    return typeof S == "number" ? "[" + S + "]" : l.test(S) ? "." + S : "['" + f(S) + "']";
  }
  function f(S) {
    return S.replace(i, "\\$&").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\f/g, "\\f").replace(/\t/g, "\\t");
  }
  function p(S, R) {
    R += "[^0-9]";
    var D = S.match(new RegExp(R, "g"));
    return D ? D.length : 0;
  }
  function m(S, R, D) {
    return R += "([^0-9])", D = D.replace(/\$/g, "$$$$"), S.replace(new RegExp(R, "g"), D + "$1");
  }
  function b(S, R) {
    if (typeof S == "boolean") return !S;
    for (var D in S) if (R[D]) return !0;
  }
  function c(S, R, D) {
    if (typeof S == "boolean") return !S && D != "not";
    for (var L in S) if (L != D && R[L]) return !0;
  }
  function h(S, R) {
    if (typeof S != "boolean") {
      for (var D in S) if (!R[D]) return D;
    }
  }
  function _(S) {
    return "'" + f(S) + "'";
  }
  function g(S, R, D, L) {
    var M = D ? "'/' + " + R + (L ? "" : ".replace(/~/g, '~0').replace(/\\//g, '~1')") : L ? "'[' + " + R + " + ']'" : "'[\\'' + " + R + " + '\\']'";
    return x(S, M);
  }
  function E(S, R, D) {
    var L = _(D ? "/" + k(R) : u(R));
    return x(S, L);
  }
  var j = /^\/(?:[^~]|~0|~1)*$/, T = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function P(S, R, D) {
    var L, M, J, te;
    if (S === "") return "rootData";
    if (S[0] == "/") {
      if (!j.test(S)) throw new Error("Invalid JSON-pointer: " + S);
      M = S, J = "rootData";
    } else {
      if (te = S.match(T), !te) throw new Error("Invalid JSON-pointer: " + S);
      if (L = +te[1], M = te[2], M == "#") {
        if (L >= R) throw new Error("Cannot access property/index " + L + " levels up, current level is " + R);
        return D[R - L];
      }
      if (L > R) throw new Error("Cannot access data " + L + " levels up, current level is " + R);
      if (J = "data" + (R - L || ""), !M) return J;
    }
    for (var Q = J, ie = M.split("/"), X = 0; X < ie.length; X++) {
      var ee = ie[X];
      ee && (J += u(C(ee)), Q += " && " + J);
    }
    return Q;
  }
  function x(S, R) {
    return S == '""' ? R : (S + " + " + R).replace(/([^\\])' \+ '/g, "$1");
  }
  function $(S) {
    return C(decodeURIComponent(S));
  }
  function A(S) {
    return encodeURIComponent(k(S));
  }
  function k(S) {
    return S.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  function C(S) {
    return S.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  return gt;
}
var yt, Za;
function hn() {
  if (Za) return yt;
  Za = 1;
  var n = xr();
  yt = e;
  function e(t) {
    n.copy(t, this);
  }
  return yt;
}
var _t = { exports: {} }, Va;
function Jo() {
  if (Va) return _t.exports;
  Va = 1;
  var n = _t.exports = function(a, r, s) {
    typeof r == "function" && (s = r, r = {}), s = r.cb || s;
    var l = typeof s == "function" ? s : s.pre || function() {
    }, i = s.post || function() {
    };
    e(r, l, i, a, "", a);
  };
  n.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0
  }, n.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, n.propsKeywords = {
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, n.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function e(a, r, s, l, i, u, f, p, m, b) {
    if (l && typeof l == "object" && !Array.isArray(l)) {
      r(l, i, u, f, p, m, b);
      for (var c in l) {
        var h = l[c];
        if (Array.isArray(h)) {
          if (c in n.arrayKeywords)
            for (var _ = 0; _ < h.length; _++)
              e(a, r, s, h[_], i + "/" + c + "/" + _, u, i, c, l, _);
        } else if (c in n.propsKeywords) {
          if (h && typeof h == "object")
            for (var g in h)
              e(a, r, s, h[g], i + "/" + c + "/" + t(g), u, i, c, l, g);
        } else (c in n.keywords || a.allKeys && !(c in n.skipKeywords)) && e(a, r, s, h, i + "/" + c, u, i, c, l);
      }
      s(l, i, u, f, p, m, b);
    }
  }
  function t(a) {
    return a.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return _t.exports;
}
var bt, Ha;
function ba() {
  if (Ha) return bt;
  Ha = 1;
  var n = Vo(), e = _a(), t = xr(), a = hn(), r = Jo();
  bt = s, s.normalizeId = E, s.fullPath = h, s.url = j, s.ids = T, s.inlineRef = m, s.schema = l;
  function s(P, x, $) {
    var A = this._refs[$];
    if (typeof A == "string")
      if (this._refs[A]) A = this._refs[A];
      else return s.call(this, P, x, A);
    if (A = A || this._schemas[$], A instanceof a)
      return m(A.schema, this._opts.inlineRefs) ? A.schema : A.validate || this._compile(A);
    var k = l.call(this, x, $), C, S, R;
    return k && (C = k.schema, x = k.root, R = k.baseId), C instanceof a ? S = C.validate || P.call(this, C.schema, x, void 0, R) : C !== void 0 && (S = m(C, this._opts.inlineRefs) ? C : P.call(this, C, x, void 0, R)), S;
  }
  function l(P, x) {
    var $ = n.parse(x), A = _($), k = h(this._getId(P.schema));
    if (Object.keys(P.schema).length === 0 || A !== k) {
      var C = E(A), S = this._refs[C];
      if (typeof S == "string")
        return i.call(this, P, S, $);
      if (S instanceof a)
        S.validate || this._compile(S), P = S;
      else if (S = this._schemas[C], S instanceof a) {
        if (S.validate || this._compile(S), C == E(x))
          return { schema: S, root: P, baseId: k };
        P = S;
      } else
        return;
      if (!P.schema) return;
      k = h(this._getId(P.schema));
    }
    return f.call(this, $, k, P.schema, P);
  }
  function i(P, x, $) {
    var A = l.call(this, P, x);
    if (A) {
      var k = A.schema, C = A.baseId;
      P = A.root;
      var S = this._getId(k);
      return S && (C = j(C, S)), f.call(this, $, C, k, P);
    }
  }
  var u = t.toHash(["properties", "patternProperties", "enum", "dependencies", "definitions"]);
  function f(P, x, $, A) {
    if (P.fragment = P.fragment || "", P.fragment.slice(0, 1) == "/") {
      for (var k = P.fragment.split("/"), C = 1; C < k.length; C++) {
        var S = k[C];
        if (S) {
          if (S = t.unescapeFragment(S), $ = $[S], $ === void 0) break;
          var R;
          if (!u[S] && (R = this._getId($), R && (x = j(x, R)), $.$ref)) {
            var D = j(x, $.$ref), L = l.call(this, A, D);
            L && ($ = L.schema, A = L.root, x = L.baseId);
          }
        }
      }
      if ($ !== void 0 && $ !== A.schema)
        return { schema: $, root: A, baseId: x };
    }
  }
  var p = t.toHash([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum"
  ]);
  function m(P, x) {
    if (x === !1) return !1;
    if (x === void 0 || x === !0) return b(P);
    if (x) return c(P) <= x;
  }
  function b(P) {
    var x;
    if (Array.isArray(P)) {
      for (var $ = 0; $ < P.length; $++)
        if (x = P[$], typeof x == "object" && !b(x)) return !1;
    } else
      for (var A in P)
        if (A == "$ref" || (x = P[A], typeof x == "object" && !b(x))) return !1;
    return !0;
  }
  function c(P) {
    var x = 0, $;
    if (Array.isArray(P)) {
      for (var A = 0; A < P.length; A++)
        if ($ = P[A], typeof $ == "object" && (x += c($)), x == 1 / 0) return 1 / 0;
    } else
      for (var k in P) {
        if (k == "$ref") return 1 / 0;
        if (p[k])
          x++;
        else if ($ = P[k], typeof $ == "object" && (x += c($) + 1), x == 1 / 0) return 1 / 0;
      }
    return x;
  }
  function h(P, x) {
    x !== !1 && (P = E(P));
    var $ = n.parse(P);
    return _($);
  }
  function _(P) {
    return n.serialize(P).split("#")[0] + "#";
  }
  var g = /#\/?$/;
  function E(P) {
    return P ? P.replace(g, "") : "";
  }
  function j(P, x) {
    return x = E(x), n.resolve(P, x);
  }
  function T(P) {
    var x = E(this._getId(P)), $ = { "": x }, A = { "": h(x, !1) }, k = {}, C = this;
    return r(P, { allKeys: !0 }, function(S, R, D, L, M, J, te) {
      if (R !== "") {
        var Q = C._getId(S), ie = $[L], X = A[L] + "/" + M;
        if (te !== void 0 && (X += "/" + (typeof te == "number" ? te : t.escapeFragment(te))), typeof Q == "string") {
          Q = ie = E(ie ? n.resolve(ie, Q) : Q);
          var ee = C._refs[Q];
          if (typeof ee == "string" && (ee = C._refs[ee]), ee && ee.schema) {
            if (!e(S, ee.schema))
              throw new Error('id "' + Q + '" resolves to more than one schema');
          } else if (Q != E(X))
            if (Q[0] == "#") {
              if (k[Q] && !e(S, k[Q]))
                throw new Error('id "' + Q + '" resolves to more than one schema');
              k[Q] = S;
            } else
              C._refs[Q] = X;
        }
        $[R] = ie, A[R] = X;
      }
    }), k;
  }
  return bt;
}
var Pt, Ja;
function Pa() {
  if (Ja) return Pt;
  Ja = 1;
  var n = ba();
  Pt = {
    Validation: a(e),
    MissingRef: a(t)
  };
  function e(r) {
    this.message = "validation failed", this.errors = r, this.ajv = this.validation = !0;
  }
  t.message = function(r, s) {
    return "can't resolve reference " + s + " from id " + r;
  };
  function t(r, s, l) {
    this.message = l || t.message(r, s), this.missingRef = n.url(r, s), this.missingSchema = n.normalizeId(n.fullPath(this.missingRef));
  }
  function a(r) {
    return r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r;
  }
  return Pt;
}
var Et, Ba;
function pn() {
  return Ba || (Ba = 1, Et = function(n, e) {
    e || (e = {}), typeof e == "function" && (e = { cmp: e });
    var t = typeof e.cycles == "boolean" ? e.cycles : !1, a = e.cmp && /* @__PURE__ */ function(s) {
      return function(l) {
        return function(i, u) {
          var f = { key: i, value: l[i] }, p = { key: u, value: l[u] };
          return s(f, p);
        };
      };
    }(e.cmp), r = [];
    return function s(l) {
      if (l && l.toJSON && typeof l.toJSON == "function" && (l = l.toJSON()), l !== void 0) {
        if (typeof l == "number") return isFinite(l) ? "" + l : "null";
        if (typeof l != "object") return JSON.stringify(l);
        var i, u;
        if (Array.isArray(l)) {
          for (u = "[", i = 0; i < l.length; i++)
            i && (u += ","), u += s(l[i]) || "null";
          return u + "]";
        }
        if (l === null) return "null";
        if (r.indexOf(l) !== -1) {
          if (t) return JSON.stringify("__cycle__");
          throw new TypeError("Converting circular structure to JSON");
        }
        var f = r.push(l) - 1, p = Object.keys(l).sort(a && a(l));
        for (u = "", i = 0; i < p.length; i++) {
          var m = p[i], b = s(l[m]);
          b && (u && (u += ","), u += JSON.stringify(m) + ":" + b);
        }
        return r.splice(f, 1), "{" + u + "}";
      }
    }(n);
  }), Et;
}
var St, Ka;
function mn() {
  return Ka || (Ka = 1, St = function(e, t, a) {
    var r = "", s = e.schema.$async === !0, l = e.util.schemaHasRulesExcept(e.schema, e.RULES.all, "$ref"), i = e.self._getId(e.schema);
    if (e.opts.strictKeywords) {
      var u = e.util.schemaUnknownRules(e.schema, e.RULES.keywords);
      if (u) {
        var f = "unknown keyword: " + u;
        if (e.opts.strictKeywords === "log") e.logger.warn(f);
        else throw new Error(f);
      }
    }
    if (e.isTop && (r += " var validate = ", s && (e.async = !0, r += "async "), r += "function(data, dataPath, parentData, parentDataProperty, rootData) { 'use strict'; ", i && (e.opts.sourceCode || e.opts.processCode) && (r += " " + ("/*# sourceURL=" + i + " */") + " ")), typeof e.schema == "boolean" || !(l || e.schema.$ref)) {
      var t = "false schema", p = e.level, m = e.dataLevel, b = e.schema[t], c = e.schemaPath + e.util.getProperty(t), h = e.errSchemaPath + "/" + t, x = !e.opts.allErrors, k, _ = "data" + (m || ""), P = "valid" + p;
      if (e.schema === !1) {
        e.isTop ? x = !0 : r += " var " + P + " = false; ";
        var g = g || [];
        g.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (k || "false schema") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(h) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'boolean schema is false' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + _ + " "), r += " } ") : r += " {} ";
        var E = r;
        r = g.pop(), !e.compositeRule && x ? e.async ? r += " throw new ValidationError([" + E + "]); " : r += " validate.errors = [" + E + "]; return false; " : r += " var err = " + E + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
      } else
        e.isTop ? s ? r += " return data; " : r += " validate.errors = null; return true; " : r += " var " + P + " = true; ";
      return e.isTop && (r += " }; return validate; "), r;
    }
    if (e.isTop) {
      var j = e.isTop, p = e.level = 0, m = e.dataLevel = 0, _ = "data";
      if (e.rootId = e.resolve.fullPath(e.self._getId(e.root.schema)), e.baseId = e.baseId || e.rootId, delete e.isTop, e.dataPathArr = [""], e.schema.default !== void 0 && e.opts.useDefaults && e.opts.strictDefaults) {
        var T = "default is ignored in the schema root";
        if (e.opts.strictDefaults === "log") e.logger.warn(T);
        else throw new Error(T);
      }
      r += " var vErrors = null; ", r += " var errors = 0;     ", r += " if (rootData === undefined) rootData = data; ";
    } else {
      var p = e.level, m = e.dataLevel, _ = "data" + (m || "");
      if (i && (e.baseId = e.resolve.url(e.baseId, i)), s && !e.async) throw new Error("async schema in sync schema");
      r += " var errs_" + p + " = errors;";
    }
    var P = "valid" + p, x = !e.opts.allErrors, $ = "", A = "", k, C = e.schema.type, S = Array.isArray(C);
    if (C && e.opts.nullable && e.schema.nullable === !0 && (S ? C.indexOf("null") == -1 && (C = C.concat("null")) : C != "null" && (C = [C, "null"], S = !0)), S && C.length == 1 && (C = C[0], S = !1), e.schema.$ref && l) {
      if (e.opts.extendRefs == "fail")
        throw new Error('$ref: validation keywords used in schema at path "' + e.errSchemaPath + '" (see option extendRefs)');
      e.opts.extendRefs !== !0 && (l = !1, e.logger.warn('$ref: keywords ignored in schema at path "' + e.errSchemaPath + '"'));
    }
    if (e.schema.$comment && e.opts.$comment && (r += " " + e.RULES.all.$comment.code(e, "$comment")), C) {
      if (e.opts.coerceTypes)
        var R = e.util.coerceToTypes(e.opts.coerceTypes, C);
      var D = e.RULES.types[C];
      if (R || S || D === !0 || D && !_e(D)) {
        var c = e.schemaPath + ".type", h = e.errSchemaPath + "/type", c = e.schemaPath + ".type", h = e.errSchemaPath + "/type", L = S ? "checkDataTypes" : "checkDataType";
        if (r += " if (" + e.util[L](C, _, e.opts.strictNumbers, !0) + ") { ", R) {
          var M = "dataType" + p, J = "coerced" + p;
          r += " var " + M + " = typeof " + _ + "; var " + J + " = undefined; ", e.opts.coerceTypes == "array" && (r += " if (" + M + " == 'object' && Array.isArray(" + _ + ") && " + _ + ".length == 1) { " + _ + " = " + _ + "[0]; " + M + " = typeof " + _ + "; if (" + e.util.checkDataType(e.schema.type, _, e.opts.strictNumbers) + ") " + J + " = " + _ + "; } "), r += " if (" + J + " !== undefined) ; ";
          var te = R;
          if (te)
            for (var Q, ie = -1, X = te.length - 1; ie < X; )
              Q = te[ie += 1], Q == "string" ? r += " else if (" + M + " == 'number' || " + M + " == 'boolean') " + J + " = '' + " + _ + "; else if (" + _ + " === null) " + J + " = ''; " : Q == "number" || Q == "integer" ? (r += " else if (" + M + " == 'boolean' || " + _ + " === null || (" + M + " == 'string' && " + _ + " && " + _ + " == +" + _ + " ", Q == "integer" && (r += " && !(" + _ + " % 1)"), r += ")) " + J + " = +" + _ + "; ") : Q == "boolean" ? r += " else if (" + _ + " === 'false' || " + _ + " === 0 || " + _ + " === null) " + J + " = false; else if (" + _ + " === 'true' || " + _ + " === 1) " + J + " = true; " : Q == "null" ? r += " else if (" + _ + " === '' || " + _ + " === 0 || " + _ + " === false) " + J + " = null; " : e.opts.coerceTypes == "array" && Q == "array" && (r += " else if (" + M + " == 'string' || " + M + " == 'number' || " + M + " == 'boolean' || " + _ + " == null) " + J + " = [" + _ + "]; ");
          r += " else {   ";
          var g = g || [];
          g.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (k || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(h) + " , params: { type: '", S ? r += "" + C.join(",") : r += "" + C, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", S ? r += "" + C.join(",") : r += "" + C, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + _ + " "), r += " } ") : r += " {} ";
          var E = r;
          r = g.pop(), !e.compositeRule && x ? e.async ? r += " throw new ValidationError([" + E + "]); " : r += " validate.errors = [" + E + "]; return false; " : r += " var err = " + E + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } if (" + J + " !== undefined) {  ";
          var ee = m ? "data" + (m - 1 || "") : "parentData", Ce = m ? e.dataPathArr[m] : "parentDataProperty";
          r += " " + _ + " = " + J + "; ", m || (r += "if (" + ee + " !== undefined)"), r += " " + ee + "[" + Ce + "] = " + J + "; } ";
        } else {
          var g = g || [];
          g.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (k || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(h) + " , params: { type: '", S ? r += "" + C.join(",") : r += "" + C, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", S ? r += "" + C.join(",") : r += "" + C, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + _ + " "), r += " } ") : r += " {} ";
          var E = r;
          r = g.pop(), !e.compositeRule && x ? e.async ? r += " throw new ValidationError([" + E + "]); " : r += " validate.errors = [" + E + "]; return false; " : r += " var err = " + E + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
        }
        r += " } ";
      }
    }
    if (e.schema.$ref && !l)
      r += " " + e.RULES.all.$ref.code(e, "$ref") + " ", x && (r += " } if (errors === ", j ? r += "0" : r += "errs_" + p, r += ") { ", A += "}");
    else {
      var Te = e.RULES;
      if (Te) {
        for (var D, $e = -1, Ee = Te.length - 1; $e < Ee; )
          if (D = Te[$e += 1], _e(D)) {
            if (D.type && (r += " if (" + e.util.checkDataType(D.type, _, e.opts.strictNumbers) + ") { "), e.opts.useDefaults) {
              if (D.type == "object" && e.schema.properties) {
                var b = e.schema.properties, Le = Object.keys(b), w = Le;
                if (w)
                  for (var N, Z = -1, Y = w.length - 1; Z < Y; ) {
                    N = w[Z += 1];
                    var F = b[N];
                    if (F.default !== void 0) {
                      var U = _ + e.util.getProperty(N);
                      if (e.compositeRule) {
                        if (e.opts.strictDefaults) {
                          var T = "default is ignored for: " + U;
                          if (e.opts.strictDefaults === "log") e.logger.warn(T);
                          else throw new Error(T);
                        }
                      } else
                        r += " if (" + U + " === undefined ", e.opts.useDefaults == "empty" && (r += " || " + U + " === null || " + U + " === '' "), r += " ) " + U + " = ", e.opts.useDefaults == "shared" ? r += " " + e.useDefault(F.default) + " " : r += " " + JSON.stringify(F.default) + " ", r += "; ";
                    }
                  }
              } else if (D.type == "array" && Array.isArray(e.schema.items)) {
                var se = e.schema.items;
                if (se) {
                  for (var F, ie = -1, le = se.length - 1; ie < le; )
                    if (F = se[ie += 1], F.default !== void 0) {
                      var U = _ + "[" + ie + "]";
                      if (e.compositeRule) {
                        if (e.opts.strictDefaults) {
                          var T = "default is ignored for: " + U;
                          if (e.opts.strictDefaults === "log") e.logger.warn(T);
                          else throw new Error(T);
                        }
                      } else
                        r += " if (" + U + " === undefined ", e.opts.useDefaults == "empty" && (r += " || " + U + " === null || " + U + " === '' "), r += " ) " + U + " = ", e.opts.useDefaults == "shared" ? r += " " + e.useDefault(F.default) + " " : r += " " + JSON.stringify(F.default) + " ", r += "; ";
                    }
                }
              }
            }
            var oe = D.rules;
            if (oe) {
              for (var ve, fe = -1, he = oe.length - 1; fe < he; )
                if (ve = oe[fe += 1], Ze(ve)) {
                  var Ae = ve.code(e, ve.keyword, D.type);
                  Ae && (r += " " + Ae + " ", x && ($ += "}"));
                }
            }
            if (x && (r += " " + $ + " ", $ = ""), D.type && (r += " } ", C && C === D.type && !R)) {
              r += " else { ";
              var c = e.schemaPath + ".type", h = e.errSchemaPath + "/type", g = g || [];
              g.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (k || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(h) + " , params: { type: '", S ? r += "" + C.join(",") : r += "" + C, r += "' } ", e.opts.messages !== !1 && (r += " , message: 'should be ", S ? r += "" + C.join(",") : r += "" + C, r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + c + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + _ + " "), r += " } ") : r += " {} ";
              var E = r;
              r = g.pop(), !e.compositeRule && x ? e.async ? r += " throw new ValidationError([" + E + "]); " : r += " validate.errors = [" + E + "]; return false; " : r += " var err = " + E + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ";
            }
            x && (r += " if (errors === ", j ? r += "0" : r += "errs_" + p, r += ") { ", A += "}");
          }
      }
    }
    x && (r += " " + A + " "), j ? (s ? (r += " if (errors === 0) return data;           ", r += " else throw new ValidationError(vErrors); ") : (r += " validate.errors = vErrors; ", r += " return errors === 0;       "), r += " }; return validate;") : r += " var " + P + " = errors === errs_" + p + ";";
    function _e(Pe) {
      for (var Se = Pe.rules, Ne = 0; Ne < Se.length; Ne++)
        if (Ze(Se[Ne])) return !0;
    }
    function Ze(Pe) {
      return e.schema[Pe.keyword] !== void 0 || Pe.implements && je(Pe);
    }
    function je(Pe) {
      for (var Se = Pe.implements, Ne = 0; Ne < Se.length; Ne++)
        if (e.schema[Se[Ne]] !== void 0) return !0;
    }
    return r;
  }), St;
}
var wt, Qa;
function Bo() {
  if (Qa) return wt;
  Qa = 1;
  var n = ba(), e = xr(), t = Pa(), a = pn(), r = mn(), s = e.ucs2length, l = _a(), i = t.Validation;
  wt = u;
  function u(E, j, T, P) {
    var x = this, $ = this._opts, A = [void 0], k = {}, C = [], S = {}, R = [], D = {}, L = [];
    j = j || { schema: E, refVal: A, refs: k };
    var M = f.call(this, E, j, P), J = this._compilations[M.index];
    if (M.compiling) return J.callValidate = ee;
    var te = this._formats, Q = this.RULES;
    try {
      var ie = Ce(E, j, T, P);
      J.validate = ie;
      var X = J.callValidate;
      return X && (X.schema = ie.schema, X.errors = null, X.refs = ie.refs, X.refVal = ie.refVal, X.root = ie.root, X.$async = ie.$async, $.sourceCode && (X.source = ie.source)), ie;
    } finally {
      p.call(this, E, j, P);
    }
    function ee() {
      var F = J.validate, U = F.apply(this, arguments);
      return ee.errors = F.errors, U;
    }
    function Ce(F, U, se, le) {
      var oe = !U || U && U.schema == F;
      if (U.schema != j.schema)
        return u.call(x, F, U, se, le);
      var ve = F.$async === !0, fe = r({
        isTop: !0,
        schema: F,
        isRoot: oe,
        baseId: le,
        root: U,
        schemaPath: "",
        errSchemaPath: "#",
        errorPath: '""',
        MissingRefError: t.MissingRef,
        RULES: Q,
        validate: r,
        util: e,
        resolve: n,
        resolveRef: Te,
        usePattern: N,
        useDefault: Z,
        useCustomRule: Y,
        opts: $,
        formats: te,
        logger: x.logger,
        self: x
      });
      fe = g(A, h) + g(C, b) + g(R, c) + g(L, _) + fe, $.processCode && (fe = $.processCode(fe, F));
      var he;
      try {
        var Ae = new Function(
          "self",
          "RULES",
          "formats",
          "root",
          "refVal",
          "defaults",
          "customRules",
          "equal",
          "ucs2length",
          "ValidationError",
          fe
        );
        he = Ae(
          x,
          Q,
          te,
          j,
          A,
          R,
          L,
          l,
          s,
          i
        ), A[0] = he;
      } catch (_e) {
        throw x.logger.error("Error compiling schema, function code:", fe), _e;
      }
      return he.schema = F, he.errors = null, he.refs = k, he.refVal = A, he.root = oe ? he : U, ve && (he.$async = !0), $.sourceCode === !0 && (he.source = {
        code: fe,
        patterns: C,
        defaults: R
      }), he;
    }
    function Te(F, U, se) {
      U = n.url(F, U);
      var le = k[U], oe, ve;
      if (le !== void 0)
        return oe = A[le], ve = "refVal[" + le + "]", w(oe, ve);
      if (!se && j.refs) {
        var fe = j.refs[U];
        if (fe !== void 0)
          return oe = j.refVal[fe], ve = $e(U, oe), w(oe, ve);
      }
      ve = $e(U);
      var he = n.call(x, Ce, j, U);
      if (he === void 0) {
        var Ae = T && T[U];
        Ae && (he = n.inlineRef(Ae, $.inlineRefs) ? Ae : u.call(x, Ae, j, T, F));
      }
      if (he === void 0)
        Ee(U);
      else
        return Le(U, he), w(he, ve);
    }
    function $e(F, U) {
      var se = A.length;
      return A[se] = U, k[F] = se, "refVal" + se;
    }
    function Ee(F) {
      delete k[F];
    }
    function Le(F, U) {
      var se = k[F];
      A[se] = U;
    }
    function w(F, U) {
      return typeof F == "object" || typeof F == "boolean" ? { code: U, schema: F, inline: !0 } : { code: U, $async: F && !!F.$async };
    }
    function N(F) {
      var U = S[F];
      return U === void 0 && (U = S[F] = C.length, C[U] = F), "pattern" + U;
    }
    function Z(F) {
      switch (typeof F) {
        case "boolean":
        case "number":
          return "" + F;
        case "string":
          return e.toQuotedString(F);
        case "object":
          if (F === null) return "null";
          var U = a(F), se = D[U];
          return se === void 0 && (se = D[U] = R.length, R[se] = F), "default" + se;
      }
    }
    function Y(F, U, se, le) {
      if (x._opts.validateSchema !== !1) {
        var oe = F.definition.dependencies;
        if (oe && !oe.every(function(Se) {
          return Object.prototype.hasOwnProperty.call(se, Se);
        }))
          throw new Error("parent schema must have all required keywords: " + oe.join(","));
        var ve = F.definition.validateSchema;
        if (ve) {
          var fe = ve(U);
          if (!fe) {
            var he = "keyword schema is invalid: " + x.errorsText(ve.errors);
            if (x._opts.validateSchema == "log") x.logger.error(he);
            else throw new Error(he);
          }
        }
      }
      var Ae = F.definition.compile, _e = F.definition.inline, Ze = F.definition.macro, je;
      if (Ae)
        je = Ae.call(x, U, se, le);
      else if (Ze)
        je = Ze.call(x, U, se, le), $.validateSchema !== !1 && x.validateSchema(je, !0);
      else if (_e)
        je = _e.call(x, le, F.keyword, U, se);
      else if (je = F.definition.validate, !je) return;
      if (je === void 0)
        throw new Error('custom keyword "' + F.keyword + '"failed to compile');
      var Pe = L.length;
      return L[Pe] = je, {
        code: "customRule" + Pe,
        validate: je
      };
    }
  }
  function f(E, j, T) {
    var P = m.call(this, E, j, T);
    return P >= 0 ? { index: P, compiling: !0 } : (P = this._compilations.length, this._compilations[P] = {
      schema: E,
      root: j,
      baseId: T
    }, { index: P, compiling: !1 });
  }
  function p(E, j, T) {
    var P = m.call(this, E, j, T);
    P >= 0 && this._compilations.splice(P, 1);
  }
  function m(E, j, T) {
    for (var P = 0; P < this._compilations.length; P++) {
      var x = this._compilations[P];
      if (x.schema == E && x.root == j && x.baseId == T) return P;
    }
    return -1;
  }
  function b(E, j) {
    return "var pattern" + E + " = new RegExp(" + e.toQuotedString(j[E]) + ");";
  }
  function c(E) {
    return "var default" + E + " = defaults[" + E + "];";
  }
  function h(E, j) {
    return j[E] === void 0 ? "" : "var refVal" + E + " = refVal[" + E + "];";
  }
  function _(E) {
    return "var customRule" + E + " = customRules[" + E + "];";
  }
  function g(E, j) {
    if (!E.length) return "";
    for (var T = "", P = 0; P < E.length; P++)
      T += j(P, E);
    return T;
  }
  return wt;
}
var xt = { exports: {} }, Wa;
function Ko() {
  if (Wa) return xt.exports;
  Wa = 1;
  var n = xt.exports = function() {
    this._cache = {};
  };
  return n.prototype.put = function(t, a) {
    this._cache[t] = a;
  }, n.prototype.get = function(t) {
    return this._cache[t];
  }, n.prototype.del = function(t) {
    delete this._cache[t];
  }, n.prototype.clear = function() {
    this._cache = {};
  }, xt.exports;
}
var Rt, Ga;
function Qo() {
  if (Ga) return Rt;
  Ga = 1;
  var n = xr(), e = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, t = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], a = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i, r = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i, s = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i, l = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i, i = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i, u = /^(?:(?:http[s\u017F]?|ftp):\/\/)(?:(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+(?::(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?@)?(?:(?!10(?:\.[0-9]{1,3}){3})(?!127(?:\.[0-9]{1,3}){3})(?!169\.254(?:\.[0-9]{1,3}){2})(?!192\.168(?:\.[0-9]{1,3}){2})(?!172\.(?:1[6-9]|2[0-9]|3[01])(?:\.[0-9]{1,3}){2})(?:[1-9][0-9]?|1[0-9][0-9]|2[01][0-9]|22[0-3])(?:\.(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){2}(?:\.(?:[1-9][0-9]?|1[0-9][0-9]|2[0-4][0-9]|25[0-4]))|(?:(?:(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-)*(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)(?:\.(?:(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-)*(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)*(?:\.(?:(?:[a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){2,})))(?::[0-9]{2,5})?(?:\/(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?$/i, f = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i, p = /^(?:\/(?:[^~/]|~0|~1)*)*$/, m = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i, b = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;
  Rt = c;
  function c(A) {
    return A = A == "full" ? "full" : "fast", n.copy(c[A]);
  }
  c.fast = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: /^\d\d\d\d-[0-1]\d-[0-3]\d$/,
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,
    "date-time": /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    "uri-template": i,
    url: u,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'willful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
    hostname: r,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    // optimized http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
    ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
    regex: $,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: f,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": p,
    "json-pointer-uri-fragment": m,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": b
  }, c.full = {
    date: _,
    time: g,
    "date-time": j,
    uri: P,
    "uri-reference": l,
    "uri-template": i,
    url: u,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: r,
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
    regex: $,
    uuid: f,
    "json-pointer": p,
    "json-pointer-uri-fragment": m,
    "relative-json-pointer": b
  };
  function h(A) {
    return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0);
  }
  function _(A) {
    var k = A.match(e);
    if (!k) return !1;
    var C = +k[1], S = +k[2], R = +k[3];
    return S >= 1 && S <= 12 && R >= 1 && R <= (S == 2 && h(C) ? 29 : t[S]);
  }
  function g(A, k) {
    var C = A.match(a);
    if (!C) return !1;
    var S = C[1], R = C[2], D = C[3], L = C[5];
    return (S <= 23 && R <= 59 && D <= 59 || S == 23 && R == 59 && D == 60) && (!k || L);
  }
  var E = /t|\s/i;
  function j(A) {
    var k = A.split(E);
    return k.length == 2 && _(k[0]) && g(k[1], !0);
  }
  var T = /\/|:/;
  function P(A) {
    return T.test(A) && s.test(A);
  }
  var x = /[^\\]\\Z/;
  function $(A) {
    if (x.test(A)) return !1;
    try {
      return new RegExp(A), !0;
    } catch {
      return !1;
    }
  }
  return Rt;
}
var It, Ya;
function Wo() {
  return Ya || (Ya = 1, It = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.errSchemaPath + "/" + t, f = !e.opts.allErrors, p = "data" + (l || ""), m = "valid" + s, b, c;
    if (i == "#" || i == "#/")
      e.isRoot ? (b = e.async, c = "validate") : (b = e.root.schema.$async === !0, c = "root.refVal[0]");
    else {
      var h = e.resolveRef(e.baseId, i, e.isRoot);
      if (h === void 0) {
        var _ = e.MissingRefError.message(e.baseId, i);
        if (e.opts.missingRefs == "fail") {
          e.logger.error(_);
          var g = g || [];
          g.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '$ref' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(u) + " , params: { ref: '" + e.util.escapeQuotes(i) + "' } ", e.opts.messages !== !1 && (r += " , message: 'can\\'t resolve reference " + e.util.escapeQuotes(i) + "' "), e.opts.verbose && (r += " , schema: " + e.util.toQuotedString(i) + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + p + " "), r += " } ") : r += " {} ";
          var E = r;
          r = g.pop(), !e.compositeRule && f ? e.async ? r += " throw new ValidationError([" + E + "]); " : r += " validate.errors = [" + E + "]; return false; " : r += " var err = " + E + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", f && (r += " if (false) { ");
        } else if (e.opts.missingRefs == "ignore")
          e.logger.warn(_), f && (r += " if (true) { ");
        else
          throw new e.MissingRefError(e.baseId, i, _);
      } else if (h.inline) {
        var j = e.util.copy(e);
        j.level++;
        var T = "valid" + j.level;
        j.schema = h.schema, j.schemaPath = "", j.errSchemaPath = i;
        var P = e.validate(j).replace(/validate\.schema/g, h.code);
        r += " " + P + " ", f && (r += " if (" + T + ") { ");
      } else
        b = h.$async === !0 || e.async && h.$async !== !1, c = h.code;
    }
    if (c) {
      var g = g || [];
      g.push(r), r = "", e.opts.passContext ? r += " " + c + ".call(this, " : r += " " + c + "( ", r += " " + p + ", (dataPath || '')", e.errorPath != '""' && (r += " + " + e.errorPath);
      var x = l ? "data" + (l - 1 || "") : "parentData", $ = l ? e.dataPathArr[l] : "parentDataProperty";
      r += " , " + x + " , " + $ + ", rootData)  ";
      var A = r;
      if (r = g.pop(), b) {
        if (!e.async) throw new Error("async schema referenced by sync schema");
        f && (r += " var " + m + "; "), r += " try { await " + A + "; ", f && (r += " " + m + " = true; "), r += " } catch (e) { if (!(e instanceof ValidationError)) throw e; if (vErrors === null) vErrors = e.errors; else vErrors = vErrors.concat(e.errors); errors = vErrors.length; ", f && (r += " " + m + " = false; "), r += " } ", f && (r += " if (" + m + ") { ");
      } else
        r += " if (!" + A + ") { if (vErrors === null) vErrors = " + c + ".errors; else vErrors = vErrors.concat(" + c + ".errors); errors = vErrors.length; } ", f && (r += " else { ");
    }
    return r;
  }), It;
}
var Ot, Xa;
function Go() {
  return Xa || (Xa = 1, Ot = function(e, t, a) {
    var r = " ", s = e.schema[t], l = e.schemaPath + e.util.getProperty(t), i = e.errSchemaPath + "/" + t, u = !e.opts.allErrors, f = e.util.copy(e), p = "";
    f.level++;
    var m = "valid" + f.level, b = f.baseId, c = !0, h = s;
    if (h)
      for (var _, g = -1, E = h.length - 1; g < E; )
        _ = h[g += 1], (e.opts.strictKeywords ? typeof _ == "object" && Object.keys(_).length > 0 || _ === !1 : e.util.schemaHasRules(_, e.RULES.all)) && (c = !1, f.schema = _, f.schemaPath = l + "[" + g + "]", f.errSchemaPath = i + "/" + g, r += "  " + e.validate(f) + " ", f.baseId = b, u && (r += " if (" + m + ") { ", p += "}"));
    return u && (c ? r += " if (true) { " : r += " " + p.slice(0, -1) + " "), r;
  }), Ot;
}
var $t, es;
function Yo() {
  return es || (es = 1, $t = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = "valid" + s, c = "errs__" + s, h = e.util.copy(e), _ = "";
    h.level++;
    var g = "valid" + h.level, E = i.every(function(k) {
      return e.opts.strictKeywords ? typeof k == "object" && Object.keys(k).length > 0 || k === !1 : e.util.schemaHasRules(k, e.RULES.all);
    });
    if (E) {
      var j = h.baseId;
      r += " var " + c + " = errors; var " + b + " = false;  ";
      var T = e.compositeRule;
      e.compositeRule = h.compositeRule = !0;
      var P = i;
      if (P)
        for (var x, $ = -1, A = P.length - 1; $ < A; )
          x = P[$ += 1], h.schema = x, h.schemaPath = u + "[" + $ + "]", h.errSchemaPath = f + "/" + $, r += "  " + e.validate(h) + " ", h.baseId = j, r += " " + b + " = " + b + " || " + g + "; if (!" + b + ") { ", _ += "}";
      e.compositeRule = h.compositeRule = T, r += " " + _ + " if (!" + b + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'anyOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should match some schema in anyOf' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && p && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += " } else {  errors = " + c + "; if (vErrors !== null) { if (" + c + ") vErrors.length = " + c + "; else vErrors = null; } ", e.opts.allErrors && (r += " } ");
    } else
      p && (r += " if (true) { ");
    return r;
  }), $t;
}
var Tt, rs;
function Xo() {
  return rs || (rs = 1, Tt = function(e, t, a) {
    var r = " ", s = e.schema[t], l = e.errSchemaPath + "/" + t;
    e.opts.allErrors;
    var i = e.util.toQuotedString(s);
    return e.opts.$comment === !0 ? r += " console.log(" + i + ");" : typeof e.opts.$comment == "function" && (r += " self._opts.$comment(" + i + ", " + e.util.toQuotedString(l) + ", validate.root.schema);"), r;
  }), Tt;
}
var At, ts;
function el() {
  return ts || (ts = 1, At = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = "valid" + s, c = e.opts.$data && i && i.$data;
    c && (r += " var schema" + s + " = " + e.util.getData(i.$data, l, e.dataPathArr) + "; "), c || (r += " var schema" + s + " = validate.schema" + u + ";"), r += "var " + b + " = equal(" + m + ", schema" + s + "); if (!" + b + ") {   ";
    var h = h || [];
    h.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'const' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { allowedValue: schema" + s + " } ", e.opts.messages !== !1 && (r += " , message: 'should be equal to constant' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var _ = r;
    return r = h.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + _ + "]); " : r += " validate.errors = [" + _ + "]; return false; " : r += " var err = " + _ + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " }", p && (r += " else { "), r;
  }), At;
}
var kt, as;
function rl() {
  return as || (as = 1, kt = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = "valid" + s, c = "errs__" + s, h = e.util.copy(e), _ = "";
    h.level++;
    var g = "valid" + h.level, E = "i" + s, j = h.dataLevel = e.dataLevel + 1, T = "data" + j, P = e.baseId, x = e.opts.strictKeywords ? typeof i == "object" && Object.keys(i).length > 0 || i === !1 : e.util.schemaHasRules(i, e.RULES.all);
    if (r += "var " + c + " = errors;var " + b + ";", x) {
      var $ = e.compositeRule;
      e.compositeRule = h.compositeRule = !0, h.schema = i, h.schemaPath = u, h.errSchemaPath = f, r += " var " + g + " = false; for (var " + E + " = 0; " + E + " < " + m + ".length; " + E + "++) { ", h.errorPath = e.util.getPathExpr(e.errorPath, E, e.opts.jsonPointers, !0);
      var A = m + "[" + E + "]";
      h.dataPathArr[j] = E;
      var k = e.validate(h);
      h.baseId = P, e.util.varOccurences(k, T) < 2 ? r += " " + e.util.varReplace(k, T, A) + " " : r += " var " + T + " = " + A + "; " + k + " ", r += " if (" + g + ") break; }  ", e.compositeRule = h.compositeRule = $, r += " " + _ + " if (!" + g + ") {";
    } else
      r += " if (" + m + ".length == 0) {";
    var C = C || [];
    C.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'contains' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should contain a valid item' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var S = r;
    return r = C.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + S + "]); " : r += " validate.errors = [" + S + "]; return false; " : r += " var err = " + S + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ", x && (r += "  errors = " + c + "; if (vErrors !== null) { if (" + c + ") vErrors.length = " + c + "; else vErrors = null; } "), e.opts.allErrors && (r += " } "), r;
  }), kt;
}
var Ct, ss;
function tl() {
  return ss || (ss = 1, Ct = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = "errs__" + s, c = e.util.copy(e), h = "";
    c.level++;
    var _ = "valid" + c.level, g = {}, E = {}, j = e.opts.ownProperties;
    for ($ in i)
      if ($ != "__proto__") {
        var T = i[$], P = Array.isArray(T) ? E : g;
        P[$] = T;
      }
    r += "var " + b + " = errors;";
    var x = e.errorPath;
    r += "var missing" + s + ";";
    for (var $ in E)
      if (P = E[$], P.length) {
        if (r += " if ( " + m + e.util.getProperty($) + " !== undefined ", j && (r += " && Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes($) + "') "), p) {
          r += " && ( ";
          var A = P;
          if (A)
            for (var k, C = -1, S = A.length - 1; C < S; ) {
              k = A[C += 1], C && (r += " || ");
              var R = e.util.getProperty(k), D = m + R;
              r += " ( ( " + D + " === undefined ", j && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(k) + "') "), r += ") && (missing" + s + " = " + e.util.toQuotedString(e.opts.jsonPointers ? k : R) + ") ) ";
            }
          r += ")) {  ";
          var L = "missing" + s, M = "' + " + L + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.opts.jsonPointers ? e.util.getPathExpr(x, L, !0) : x + " + " + L);
          var J = J || [];
          J.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'dependencies' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { property: '" + e.util.escapeQuotes($) + "', missingProperty: '" + M + "', depsCount: " + P.length + ", deps: '" + e.util.escapeQuotes(P.length == 1 ? P[0] : P.join(", ")) + "' } ", e.opts.messages !== !1 && (r += " , message: 'should have ", P.length == 1 ? r += "property " + e.util.escapeQuotes(P[0]) : r += "properties " + e.util.escapeQuotes(P.join(", ")), r += " when property " + e.util.escapeQuotes($) + " is present' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
          var te = r;
          r = J.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + te + "]); " : r += " validate.errors = [" + te + "]; return false; " : r += " var err = " + te + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
        } else {
          r += " ) { ";
          var Q = P;
          if (Q)
            for (var k, ie = -1, X = Q.length - 1; ie < X; ) {
              k = Q[ie += 1];
              var R = e.util.getProperty(k), M = e.util.escapeQuotes(k), D = m + R;
              e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(x, k, e.opts.jsonPointers)), r += " if ( " + D + " === undefined ", j && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(k) + "') "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'dependencies' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { property: '" + e.util.escapeQuotes($) + "', missingProperty: '" + M + "', depsCount: " + P.length + ", deps: '" + e.util.escapeQuotes(P.length == 1 ? P[0] : P.join(", ")) + "' } ", e.opts.messages !== !1 && (r += " , message: 'should have ", P.length == 1 ? r += "property " + e.util.escapeQuotes(P[0]) : r += "properties " + e.util.escapeQuotes(P.join(", ")), r += " when property " + e.util.escapeQuotes($) + " is present' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ";
            }
        }
        r += " }   ", p && (h += "}", r += " else { ");
      }
    e.errorPath = x;
    var ee = c.baseId;
    for (var $ in g) {
      var T = g[$];
      (e.opts.strictKeywords ? typeof T == "object" && Object.keys(T).length > 0 || T === !1 : e.util.schemaHasRules(T, e.RULES.all)) && (r += " " + _ + " = true; if ( " + m + e.util.getProperty($) + " !== undefined ", j && (r += " && Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes($) + "') "), r += ") { ", c.schema = T, c.schemaPath = u + e.util.getProperty($), c.errSchemaPath = f + "/" + e.util.escapeFragment($), r += "  " + e.validate(c) + " ", c.baseId = ee, r += " }  ", p && (r += " if (" + _ + ") { ", h += "}"));
    }
    return p && (r += "   " + h + " if (" + b + " == errors) {"), r;
  }), Ct;
}
var jt, ns;
function al() {
  return ns || (ns = 1, jt = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = "valid" + s, c = e.opts.$data && i && i.$data;
    c && (r += " var schema" + s + " = " + e.util.getData(i.$data, l, e.dataPathArr) + "; ");
    var h = "i" + s, _ = "schema" + s;
    c || (r += " var " + _ + " = validate.schema" + u + ";"), r += "var " + b + ";", c && (r += " if (schema" + s + " === undefined) " + b + " = true; else if (!Array.isArray(schema" + s + ")) " + b + " = false; else {"), r += "" + b + " = false;for (var " + h + "=0; " + h + "<" + _ + ".length; " + h + "++) if (equal(" + m + ", " + _ + "[" + h + "])) { " + b + " = true; break; }", c && (r += "  }  "), r += " if (!" + b + ") {   ";
    var g = g || [];
    g.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'enum' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { allowedValues: schema" + s + " } ", e.opts.messages !== !1 && (r += " , message: 'should be equal to one of the allowed values' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var E = r;
    return r = g.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + E + "]); " : r += " validate.errors = [" + E + "]; return false; " : r += " var err = " + E + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " }", p && (r += " else { "), r;
  }), jt;
}
var Dt, is;
function sl() {
  return is || (is = 1, Dt = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || "");
    if (e.opts.format === !1)
      return p && (r += " if (true) { "), r;
    var b = e.opts.$data && i && i.$data, c;
    b ? (r += " var schema" + s + " = " + e.util.getData(i.$data, l, e.dataPathArr) + "; ", c = "schema" + s) : c = i;
    var h = e.opts.unknownFormats, _ = Array.isArray(h);
    if (b) {
      var g = "format" + s, E = "isObject" + s, j = "formatType" + s;
      r += " var " + g + " = formats[" + c + "]; var " + E + " = typeof " + g + " == 'object' && !(" + g + " instanceof RegExp) && " + g + ".validate; var " + j + " = " + E + " && " + g + ".type || 'string'; if (" + E + ") { ", e.async && (r += " var async" + s + " = " + g + ".async; "), r += " " + g + " = " + g + ".validate; } if (  ", b && (r += " (" + c + " !== undefined && typeof " + c + " != 'string') || "), r += " (", h != "ignore" && (r += " (" + c + " && !" + g + " ", _ && (r += " && self._opts.unknownFormats.indexOf(" + c + ") == -1 "), r += ") || "), r += " (" + g + " && " + j + " == '" + a + "' && !(typeof " + g + " == 'function' ? ", e.async ? r += " (async" + s + " ? await " + g + "(" + m + ") : " + g + "(" + m + ")) " : r += " " + g + "(" + m + ") ", r += " : " + g + ".test(" + m + "))))) {";
    } else {
      var g = e.formats[i];
      if (!g) {
        if (h == "ignore")
          return e.logger.warn('unknown format "' + i + '" ignored in schema at path "' + e.errSchemaPath + '"'), p && (r += " if (true) { "), r;
        if (_ && h.indexOf(i) >= 0)
          return p && (r += " if (true) { "), r;
        throw new Error('unknown format "' + i + '" is used in schema at path "' + e.errSchemaPath + '"');
      }
      var E = typeof g == "object" && !(g instanceof RegExp) && g.validate, j = E && g.type || "string";
      if (E) {
        var T = g.async === !0;
        g = g.validate;
      }
      if (j != a)
        return p && (r += " if (true) { "), r;
      if (T) {
        if (!e.async) throw new Error("async format in sync schema");
        var P = "formats" + e.util.getProperty(i) + ".validate";
        r += " if (!(await " + P + "(" + m + "))) { ";
      } else {
        r += " if (! ";
        var P = "formats" + e.util.getProperty(i);
        E && (P += ".validate"), typeof g == "function" ? r += " " + P + "(" + m + ") " : r += " " + P + ".test(" + m + ") ", r += ") { ";
      }
    }
    var x = x || [];
    x.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'format' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { format:  ", b ? r += "" + c : r += "" + e.util.toQuotedString(i), r += "  } ", e.opts.messages !== !1 && (r += ` , message: 'should match format "`, b ? r += "' + " + c + " + '" : r += "" + e.util.escapeQuotes(i), r += `"' `), e.opts.verbose && (r += " , schema:  ", b ? r += "validate.schema" + u : r += "" + e.util.toQuotedString(i), r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var $ = r;
    return r = x.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + $ + "]); " : r += " validate.errors = [" + $ + "]; return false; " : r += " var err = " + $ + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", p && (r += " else { "), r;
  }), Dt;
}
var Nt, os;
function nl() {
  return os || (os = 1, Nt = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = "valid" + s, c = "errs__" + s, h = e.util.copy(e);
    h.level++;
    var _ = "valid" + h.level, g = e.schema.then, E = e.schema.else, j = g !== void 0 && (e.opts.strictKeywords ? typeof g == "object" && Object.keys(g).length > 0 || g === !1 : e.util.schemaHasRules(g, e.RULES.all)), T = E !== void 0 && (e.opts.strictKeywords ? typeof E == "object" && Object.keys(E).length > 0 || E === !1 : e.util.schemaHasRules(E, e.RULES.all)), P = h.baseId;
    if (j || T) {
      var x;
      h.createErrors = !1, h.schema = i, h.schemaPath = u, h.errSchemaPath = f, r += " var " + c + " = errors; var " + b + " = true;  ";
      var $ = e.compositeRule;
      e.compositeRule = h.compositeRule = !0, r += "  " + e.validate(h) + " ", h.baseId = P, h.createErrors = !0, r += "  errors = " + c + "; if (vErrors !== null) { if (" + c + ") vErrors.length = " + c + "; else vErrors = null; }  ", e.compositeRule = h.compositeRule = $, j ? (r += " if (" + _ + ") {  ", h.schema = e.schema.then, h.schemaPath = e.schemaPath + ".then", h.errSchemaPath = e.errSchemaPath + "/then", r += "  " + e.validate(h) + " ", h.baseId = P, r += " " + b + " = " + _ + "; ", j && T ? (x = "ifClause" + s, r += " var " + x + " = 'then'; ") : x = "'then'", r += " } ", T && (r += " else { ")) : r += " if (!" + _ + ") { ", T && (h.schema = e.schema.else, h.schemaPath = e.schemaPath + ".else", h.errSchemaPath = e.errSchemaPath + "/else", r += "  " + e.validate(h) + " ", h.baseId = P, r += " " + b + " = " + _ + "; ", j && T ? (x = "ifClause" + s, r += " var " + x + " = 'else'; ") : x = "'else'", r += " } "), r += " if (!" + b + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'if' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { failingKeyword: " + x + " } ", e.opts.messages !== !1 && (r += ` , message: 'should match "' + ` + x + ` + '" schema' `), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && p && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += " }   ", p && (r += " else { ");
    } else
      p && (r += " if (true) { ");
    return r;
  }), Nt;
}
var Ft, ls;
function il() {
  return ls || (ls = 1, Ft = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = "valid" + s, c = "errs__" + s, h = e.util.copy(e), _ = "";
    h.level++;
    var g = "valid" + h.level, E = "i" + s, j = h.dataLevel = e.dataLevel + 1, T = "data" + j, P = e.baseId;
    if (r += "var " + c + " = errors;var " + b + ";", Array.isArray(i)) {
      var x = e.schema.additionalItems;
      if (x === !1) {
        r += " " + b + " = " + m + ".length <= " + i.length + "; ";
        var $ = f;
        f = e.errSchemaPath + "/additionalItems", r += "  if (!" + b + ") {   ";
        var A = A || [];
        A.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'additionalItems' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { limit: " + i.length + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have more than " + i.length + " items' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
        var k = r;
        r = A.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + k + "]); " : r += " validate.errors = [" + k + "]; return false; " : r += " var err = " + k + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", f = $, p && (_ += "}", r += " else { ");
      }
      var C = i;
      if (C) {
        for (var S, R = -1, D = C.length - 1; R < D; )
          if (S = C[R += 1], e.opts.strictKeywords ? typeof S == "object" && Object.keys(S).length > 0 || S === !1 : e.util.schemaHasRules(S, e.RULES.all)) {
            r += " " + g + " = true; if (" + m + ".length > " + R + ") { ";
            var L = m + "[" + R + "]";
            h.schema = S, h.schemaPath = u + "[" + R + "]", h.errSchemaPath = f + "/" + R, h.errorPath = e.util.getPathExpr(e.errorPath, R, e.opts.jsonPointers, !0), h.dataPathArr[j] = R;
            var M = e.validate(h);
            h.baseId = P, e.util.varOccurences(M, T) < 2 ? r += " " + e.util.varReplace(M, T, L) + " " : r += " var " + T + " = " + L + "; " + M + " ", r += " }  ", p && (r += " if (" + g + ") { ", _ += "}");
          }
      }
      if (typeof x == "object" && (e.opts.strictKeywords ? typeof x == "object" && Object.keys(x).length > 0 || x === !1 : e.util.schemaHasRules(x, e.RULES.all))) {
        h.schema = x, h.schemaPath = e.schemaPath + ".additionalItems", h.errSchemaPath = e.errSchemaPath + "/additionalItems", r += " " + g + " = true; if (" + m + ".length > " + i.length + ") {  for (var " + E + " = " + i.length + "; " + E + " < " + m + ".length; " + E + "++) { ", h.errorPath = e.util.getPathExpr(e.errorPath, E, e.opts.jsonPointers, !0);
        var L = m + "[" + E + "]";
        h.dataPathArr[j] = E;
        var M = e.validate(h);
        h.baseId = P, e.util.varOccurences(M, T) < 2 ? r += " " + e.util.varReplace(M, T, L) + " " : r += " var " + T + " = " + L + "; " + M + " ", p && (r += " if (!" + g + ") break; "), r += " } }  ", p && (r += " if (" + g + ") { ", _ += "}");
      }
    } else if (e.opts.strictKeywords ? typeof i == "object" && Object.keys(i).length > 0 || i === !1 : e.util.schemaHasRules(i, e.RULES.all)) {
      h.schema = i, h.schemaPath = u, h.errSchemaPath = f, r += "  for (var " + E + " = 0; " + E + " < " + m + ".length; " + E + "++) { ", h.errorPath = e.util.getPathExpr(e.errorPath, E, e.opts.jsonPointers, !0);
      var L = m + "[" + E + "]";
      h.dataPathArr[j] = E;
      var M = e.validate(h);
      h.baseId = P, e.util.varOccurences(M, T) < 2 ? r += " " + e.util.varReplace(M, T, L) + " " : r += " var " + T + " = " + L + "; " + M + " ", p && (r += " if (!" + g + ") break; "), r += " }";
    }
    return p && (r += " " + _ + " if (" + c + " == errors) {"), r;
  }), Ft;
}
var qt, us;
function cs() {
  return us || (us = 1, qt = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, P, m = "data" + (l || ""), b = e.opts.$data && i && i.$data, c;
    b ? (r += " var schema" + s + " = " + e.util.getData(i.$data, l, e.dataPathArr) + "; ", c = "schema" + s) : c = i;
    var h = t == "maximum", _ = h ? "exclusiveMaximum" : "exclusiveMinimum", g = e.schema[_], E = e.opts.$data && g && g.$data, j = h ? "<" : ">", T = h ? ">" : "<", P = void 0;
    if (!(b || typeof i == "number" || i === void 0))
      throw new Error(t + " must be number");
    if (!(E || g === void 0 || typeof g == "number" || typeof g == "boolean"))
      throw new Error(_ + " must be number or boolean");
    if (E) {
      var x = e.util.getData(g.$data, l, e.dataPathArr), $ = "exclusive" + s, A = "exclType" + s, k = "exclIsNumber" + s, C = "op" + s, S = "' + " + C + " + '";
      r += " var schemaExcl" + s + " = " + x + "; ", x = "schemaExcl" + s, r += " var " + $ + "; var " + A + " = typeof " + x + "; if (" + A + " != 'boolean' && " + A + " != 'undefined' && " + A + " != 'number') { ";
      var P = _, R = R || [];
      R.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (P || "_exclusiveLimit") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: '" + _ + " should be boolean' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
      var D = r;
      r = R.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + D + "]); " : r += " validate.errors = [" + D + "]; return false; " : r += " var err = " + D + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else if ( ", b && (r += " (" + c + " !== undefined && typeof " + c + " != 'number') || "), r += " " + A + " == 'number' ? ( (" + $ + " = " + c + " === undefined || " + x + " " + j + "= " + c + ") ? " + m + " " + T + "= " + x + " : " + m + " " + T + " " + c + " ) : ( (" + $ + " = " + x + " === true) ? " + m + " " + T + "= " + c + " : " + m + " " + T + " " + c + " ) || " + m + " !== " + m + ") { var op" + s + " = " + $ + " ? '" + j + "' : '" + j + "='; ", i === void 0 && (P = _, f = e.errSchemaPath + "/" + _, c = x, b = E);
    } else {
      var k = typeof g == "number", S = j;
      if (k && b) {
        var C = "'" + S + "'";
        r += " if ( ", b && (r += " (" + c + " !== undefined && typeof " + c + " != 'number') || "), r += " ( " + c + " === undefined || " + g + " " + j + "= " + c + " ? " + m + " " + T + "= " + g + " : " + m + " " + T + " " + c + " ) || " + m + " !== " + m + ") { ";
      } else {
        k && i === void 0 ? ($ = !0, P = _, f = e.errSchemaPath + "/" + _, c = g, T += "=") : (k && (c = Math[h ? "min" : "max"](g, i)), g === (k ? c : !0) ? ($ = !0, P = _, f = e.errSchemaPath + "/" + _, T += "=") : ($ = !1, S += "="));
        var C = "'" + S + "'";
        r += " if ( ", b && (r += " (" + c + " !== undefined && typeof " + c + " != 'number') || "), r += " " + m + " " + T + " " + c + " || " + m + " !== " + m + ") { ";
      }
    }
    P = P || t;
    var R = R || [];
    R.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (P || "_limit") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { comparison: " + C + ", limit: " + c + ", exclusive: " + $ + " } ", e.opts.messages !== !1 && (r += " , message: 'should be " + S + " ", b ? r += "' + " + c : r += "" + c + "'"), e.opts.verbose && (r += " , schema:  ", b ? r += "validate.schema" + u : r += "" + i, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var D = r;
    return r = R.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + D + "]); " : r += " validate.errors = [" + D + "]; return false; " : r += " var err = " + D + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", p && (r += " else { "), r;
  }), qt;
}
var Lt, ds;
function fs() {
  return ds || (ds = 1, Lt = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, _, m = "data" + (l || ""), b = e.opts.$data && i && i.$data, c;
    if (b ? (r += " var schema" + s + " = " + e.util.getData(i.$data, l, e.dataPathArr) + "; ", c = "schema" + s) : c = i, !(b || typeof i == "number"))
      throw new Error(t + " must be number");
    var h = t == "maxItems" ? ">" : "<";
    r += "if ( ", b && (r += " (" + c + " !== undefined && typeof " + c + " != 'number') || "), r += " " + m + ".length " + h + " " + c + ") { ";
    var _ = t, g = g || [];
    g.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (_ || "_limitItems") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { limit: " + c + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have ", t == "maxItems" ? r += "more" : r += "fewer", r += " than ", b ? r += "' + " + c + " + '" : r += "" + i, r += " items' "), e.opts.verbose && (r += " , schema:  ", b ? r += "validate.schema" + u : r += "" + i, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var E = r;
    return r = g.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + E + "]); " : r += " validate.errors = [" + E + "]; return false; " : r += " var err = " + E + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", p && (r += " else { "), r;
  }), Lt;
}
var Mt, hs;
function ps() {
  return hs || (hs = 1, Mt = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, _, m = "data" + (l || ""), b = e.opts.$data && i && i.$data, c;
    if (b ? (r += " var schema" + s + " = " + e.util.getData(i.$data, l, e.dataPathArr) + "; ", c = "schema" + s) : c = i, !(b || typeof i == "number"))
      throw new Error(t + " must be number");
    var h = t == "maxLength" ? ">" : "<";
    r += "if ( ", b && (r += " (" + c + " !== undefined && typeof " + c + " != 'number') || "), e.opts.unicode === !1 ? r += " " + m + ".length " : r += " ucs2length(" + m + ") ", r += " " + h + " " + c + ") { ";
    var _ = t, g = g || [];
    g.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (_ || "_limitLength") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { limit: " + c + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT be ", t == "maxLength" ? r += "longer" : r += "shorter", r += " than ", b ? r += "' + " + c + " + '" : r += "" + i, r += " characters' "), e.opts.verbose && (r += " , schema:  ", b ? r += "validate.schema" + u : r += "" + i, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var E = r;
    return r = g.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + E + "]); " : r += " validate.errors = [" + E + "]; return false; " : r += " var err = " + E + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", p && (r += " else { "), r;
  }), Mt;
}
var Ut, ms;
function vs() {
  return ms || (ms = 1, Ut = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, _, m = "data" + (l || ""), b = e.opts.$data && i && i.$data, c;
    if (b ? (r += " var schema" + s + " = " + e.util.getData(i.$data, l, e.dataPathArr) + "; ", c = "schema" + s) : c = i, !(b || typeof i == "number"))
      throw new Error(t + " must be number");
    var h = t == "maxProperties" ? ">" : "<";
    r += "if ( ", b && (r += " (" + c + " !== undefined && typeof " + c + " != 'number') || "), r += " Object.keys(" + m + ").length " + h + " " + c + ") { ";
    var _ = t, g = g || [];
    g.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (_ || "_limitProperties") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { limit: " + c + " } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have ", t == "maxProperties" ? r += "more" : r += "fewer", r += " than ", b ? r += "' + " + c + " + '" : r += "" + i, r += " properties' "), e.opts.verbose && (r += " , schema:  ", b ? r += "validate.schema" + u : r += "" + i, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var E = r;
    return r = g.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + E + "]); " : r += " validate.errors = [" + E + "]; return false; " : r += " var err = " + E + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", p && (r += " else { "), r;
  }), Ut;
}
var zt, gs;
function ol() {
  return gs || (gs = 1, zt = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = e.opts.$data && i && i.$data, c;
    if (b ? (r += " var schema" + s + " = " + e.util.getData(i.$data, l, e.dataPathArr) + "; ", c = "schema" + s) : c = i, !(b || typeof i == "number"))
      throw new Error(t + " must be number");
    r += "var division" + s + ";if (", b && (r += " " + c + " !== undefined && ( typeof " + c + " != 'number' || "), r += " (division" + s + " = " + m + " / " + c + ", ", e.opts.multipleOfPrecision ? r += " Math.abs(Math.round(division" + s + ") - division" + s + ") > 1e-" + e.opts.multipleOfPrecision + " " : r += " division" + s + " !== parseInt(division" + s + ") ", r += " ) ", b && (r += "  )  "), r += " ) {   ";
    var h = h || [];
    h.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'multipleOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { multipleOf: " + c + " } ", e.opts.messages !== !1 && (r += " , message: 'should be multiple of ", b ? r += "' + " + c : r += "" + c + "'"), e.opts.verbose && (r += " , schema:  ", b ? r += "validate.schema" + u : r += "" + i, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var _ = r;
    return r = h.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + _ + "]); " : r += " validate.errors = [" + _ + "]; return false; " : r += " var err = " + _ + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", p && (r += " else { "), r;
  }), zt;
}
var Zt, ys;
function ll() {
  return ys || (ys = 1, Zt = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = "errs__" + s, c = e.util.copy(e);
    c.level++;
    var h = "valid" + c.level;
    if (e.opts.strictKeywords ? typeof i == "object" && Object.keys(i).length > 0 || i === !1 : e.util.schemaHasRules(i, e.RULES.all)) {
      c.schema = i, c.schemaPath = u, c.errSchemaPath = f, r += " var " + b + " = errors;  ";
      var _ = e.compositeRule;
      e.compositeRule = c.compositeRule = !0, c.createErrors = !1;
      var g;
      c.opts.allErrors && (g = c.opts.allErrors, c.opts.allErrors = !1), r += " " + e.validate(c) + " ", c.createErrors = !0, g && (c.opts.allErrors = g), e.compositeRule = c.compositeRule = _, r += " if (" + h + ") {   ";
      var E = E || [];
      E.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'not' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should NOT be valid' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
      var j = r;
      r = E.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + j + "]); " : r += " validate.errors = [" + j + "]; return false; " : r += " var err = " + j + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else {  errors = " + b + "; if (vErrors !== null) { if (" + b + ") vErrors.length = " + b + "; else vErrors = null; } ", e.opts.allErrors && (r += " } ");
    } else
      r += "  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'not' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: {} ", e.opts.messages !== !1 && (r += " , message: 'should NOT be valid' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", p && (r += " if (false) { ");
    return r;
  }), Zt;
}
var Vt, _s;
function ul() {
  return _s || (_s = 1, Vt = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = "valid" + s, c = "errs__" + s, h = e.util.copy(e), _ = "";
    h.level++;
    var g = "valid" + h.level, E = h.baseId, j = "prevValid" + s, T = "passingSchemas" + s;
    r += "var " + c + " = errors , " + j + " = false , " + b + " = false , " + T + " = null; ";
    var P = e.compositeRule;
    e.compositeRule = h.compositeRule = !0;
    var x = i;
    if (x)
      for (var $, A = -1, k = x.length - 1; A < k; )
        $ = x[A += 1], (e.opts.strictKeywords ? typeof $ == "object" && Object.keys($).length > 0 || $ === !1 : e.util.schemaHasRules($, e.RULES.all)) ? (h.schema = $, h.schemaPath = u + "[" + A + "]", h.errSchemaPath = f + "/" + A, r += "  " + e.validate(h) + " ", h.baseId = E) : r += " var " + g + " = true; ", A && (r += " if (" + g + " && " + j + ") { " + b + " = false; " + T + " = [" + T + ", " + A + "]; } else { ", _ += "}"), r += " if (" + g + ") { " + b + " = " + j + " = true; " + T + " = " + A + "; }";
    return e.compositeRule = h.compositeRule = P, r += "" + _ + "if (!" + b + ") {   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'oneOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { passingSchemas: " + T + " } ", e.opts.messages !== !1 && (r += " , message: 'should match exactly one schema in oneOf' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && p && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), r += "} else {  errors = " + c + "; if (vErrors !== null) { if (" + c + ") vErrors.length = " + c + "; else vErrors = null; }", e.opts.allErrors && (r += " } "), r;
  }), Vt;
}
var Ht, bs;
function cl() {
  return bs || (bs = 1, Ht = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = e.opts.$data && i && i.$data, c;
    b ? (r += " var schema" + s + " = " + e.util.getData(i.$data, l, e.dataPathArr) + "; ", c = "schema" + s) : c = i;
    var h = b ? "(new RegExp(" + c + "))" : e.usePattern(i);
    r += "if ( ", b && (r += " (" + c + " !== undefined && typeof " + c + " != 'string') || "), r += " !" + h + ".test(" + m + ") ) {   ";
    var _ = _ || [];
    _.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'pattern' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { pattern:  ", b ? r += "" + c : r += "" + e.util.toQuotedString(i), r += "  } ", e.opts.messages !== !1 && (r += ` , message: 'should match pattern "`, b ? r += "' + " + c + " + '" : r += "" + e.util.escapeQuotes(i), r += `"' `), e.opts.verbose && (r += " , schema:  ", b ? r += "validate.schema" + u : r += "" + e.util.toQuotedString(i), r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
    var g = r;
    return r = _.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + g + "]); " : r += " validate.errors = [" + g + "]; return false; " : r += " var err = " + g + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += "} ", p && (r += " else { "), r;
  }), Ht;
}
var Jt, Ps;
function dl() {
  return Ps || (Ps = 1, Jt = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = "errs__" + s, c = e.util.copy(e), h = "";
    c.level++;
    var _ = "valid" + c.level, g = "key" + s, E = "idx" + s, j = c.dataLevel = e.dataLevel + 1, T = "data" + j, P = "dataProperties" + s, x = Object.keys(i || {}).filter(ie), $ = e.schema.patternProperties || {}, A = Object.keys($).filter(ie), k = e.schema.additionalProperties, C = x.length || A.length, S = k === !1, R = typeof k == "object" && Object.keys(k).length, D = e.opts.removeAdditional, L = S || R || D, M = e.opts.ownProperties, J = e.baseId, te = e.schema.required;
    if (te && !(e.opts.$data && te.$data) && te.length < e.opts.loopRequired)
      var Q = e.util.toHash(te);
    function ie(ft) {
      return ft !== "__proto__";
    }
    if (r += "var " + b + " = errors;var " + _ + " = true;", M && (r += " var " + P + " = undefined;"), L) {
      if (M ? r += " " + P + " = " + P + " || Object.keys(" + m + "); for (var " + E + "=0; " + E + "<" + P + ".length; " + E + "++) { var " + g + " = " + P + "[" + E + "]; " : r += " for (var " + g + " in " + m + ") { ", C) {
        if (r += " var isAdditional" + s + " = !(false ", x.length)
          if (x.length > 8)
            r += " || validate.schema" + u + ".hasOwnProperty(" + g + ") ";
          else {
            var X = x;
            if (X)
              for (var ee, Ce = -1, Te = X.length - 1; Ce < Te; )
                ee = X[Ce += 1], r += " || " + g + " == " + e.util.toQuotedString(ee) + " ";
          }
        if (A.length) {
          var $e = A;
          if ($e)
            for (var Ee, Le = -1, w = $e.length - 1; Le < w; )
              Ee = $e[Le += 1], r += " || " + e.usePattern(Ee) + ".test(" + g + ") ";
        }
        r += " ); if (isAdditional" + s + ") { ";
      }
      if (D == "all")
        r += " delete " + m + "[" + g + "]; ";
      else {
        var N = e.errorPath, Z = "' + " + g + " + '";
        if (e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(e.errorPath, g, e.opts.jsonPointers)), S)
          if (D)
            r += " delete " + m + "[" + g + "]; ";
          else {
            r += " " + _ + " = false; ";
            var Y = f;
            f = e.errSchemaPath + "/additionalProperties";
            var F = F || [];
            F.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'additionalProperties' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { additionalProperty: '" + Z + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is an invalid additional property" : r += "should NOT have additional properties", r += "' "), e.opts.verbose && (r += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
            var U = r;
            r = F.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + U + "]); " : r += " validate.errors = [" + U + "]; return false; " : r += " var err = " + U + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", f = Y, p && (r += " break; ");
          }
        else if (R)
          if (D == "failing") {
            r += " var " + b + " = errors;  ";
            var se = e.compositeRule;
            e.compositeRule = c.compositeRule = !0, c.schema = k, c.schemaPath = e.schemaPath + ".additionalProperties", c.errSchemaPath = e.errSchemaPath + "/additionalProperties", c.errorPath = e.opts._errorDataPathProperty ? e.errorPath : e.util.getPathExpr(e.errorPath, g, e.opts.jsonPointers);
            var le = m + "[" + g + "]";
            c.dataPathArr[j] = g;
            var oe = e.validate(c);
            c.baseId = J, e.util.varOccurences(oe, T) < 2 ? r += " " + e.util.varReplace(oe, T, le) + " " : r += " var " + T + " = " + le + "; " + oe + " ", r += " if (!" + _ + ") { errors = " + b + "; if (validate.errors !== null) { if (errors) validate.errors.length = errors; else validate.errors = null; } delete " + m + "[" + g + "]; }  ", e.compositeRule = c.compositeRule = se;
          } else {
            c.schema = k, c.schemaPath = e.schemaPath + ".additionalProperties", c.errSchemaPath = e.errSchemaPath + "/additionalProperties", c.errorPath = e.opts._errorDataPathProperty ? e.errorPath : e.util.getPathExpr(e.errorPath, g, e.opts.jsonPointers);
            var le = m + "[" + g + "]";
            c.dataPathArr[j] = g;
            var oe = e.validate(c);
            c.baseId = J, e.util.varOccurences(oe, T) < 2 ? r += " " + e.util.varReplace(oe, T, le) + " " : r += " var " + T + " = " + le + "; " + oe + " ", p && (r += " if (!" + _ + ") break; ");
          }
        e.errorPath = N;
      }
      C && (r += " } "), r += " }  ", p && (r += " if (" + _ + ") { ", h += "}");
    }
    var ve = e.opts.useDefaults && !e.compositeRule;
    if (x.length) {
      var fe = x;
      if (fe)
        for (var ee, he = -1, Ae = fe.length - 1; he < Ae; ) {
          ee = fe[he += 1];
          var _e = i[ee];
          if (e.opts.strictKeywords ? typeof _e == "object" && Object.keys(_e).length > 0 || _e === !1 : e.util.schemaHasRules(_e, e.RULES.all)) {
            var Ze = e.util.getProperty(ee), le = m + Ze, je = ve && _e.default !== void 0;
            c.schema = _e, c.schemaPath = u + Ze, c.errSchemaPath = f + "/" + e.util.escapeFragment(ee), c.errorPath = e.util.getPath(e.errorPath, ee, e.opts.jsonPointers), c.dataPathArr[j] = e.util.toQuotedString(ee);
            var oe = e.validate(c);
            if (c.baseId = J, e.util.varOccurences(oe, T) < 2) {
              oe = e.util.varReplace(oe, T, le);
              var Pe = le;
            } else {
              var Pe = T;
              r += " var " + T + " = " + le + "; ";
            }
            if (je)
              r += " " + oe + " ";
            else {
              if (Q && Q[ee]) {
                r += " if ( " + Pe + " === undefined ", M && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(ee) + "') "), r += ") { " + _ + " = false; ";
                var N = e.errorPath, Y = f, Se = e.util.escapeQuotes(ee);
                e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(N, ee, e.opts.jsonPointers)), f = e.errSchemaPath + "/required";
                var F = F || [];
                F.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { missingProperty: '" + Se + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + Se + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
                var U = r;
                r = F.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + U + "]); " : r += " validate.errors = [" + U + "]; return false; " : r += " var err = " + U + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", f = Y, e.errorPath = N, r += " } else { ";
              } else
                p ? (r += " if ( " + Pe + " === undefined ", M && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(ee) + "') "), r += ") { " + _ + " = true; } else { ") : (r += " if (" + Pe + " !== undefined ", M && (r += " &&   Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(ee) + "') "), r += " ) { ");
              r += " " + oe + " } ";
            }
          }
          p && (r += " if (" + _ + ") { ", h += "}");
        }
    }
    if (A.length) {
      var Ne = A;
      if (Ne)
        for (var Ee, Qr = -1, dt = Ne.length - 1; Qr < dt; ) {
          Ee = Ne[Qr += 1];
          var _e = $[Ee];
          if (e.opts.strictKeywords ? typeof _e == "object" && Object.keys(_e).length > 0 || _e === !1 : e.util.schemaHasRules(_e, e.RULES.all)) {
            c.schema = _e, c.schemaPath = e.schemaPath + ".patternProperties" + e.util.getProperty(Ee), c.errSchemaPath = e.errSchemaPath + "/patternProperties/" + e.util.escapeFragment(Ee), M ? r += " " + P + " = " + P + " || Object.keys(" + m + "); for (var " + E + "=0; " + E + "<" + P + ".length; " + E + "++) { var " + g + " = " + P + "[" + E + "]; " : r += " for (var " + g + " in " + m + ") { ", r += " if (" + e.usePattern(Ee) + ".test(" + g + ")) { ", c.errorPath = e.util.getPathExpr(e.errorPath, g, e.opts.jsonPointers);
            var le = m + "[" + g + "]";
            c.dataPathArr[j] = g;
            var oe = e.validate(c);
            c.baseId = J, e.util.varOccurences(oe, T) < 2 ? r += " " + e.util.varReplace(oe, T, le) + " " : r += " var " + T + " = " + le + "; " + oe + " ", p && (r += " if (!" + _ + ") break; "), r += " } ", p && (r += " else " + _ + " = true; "), r += " }  ", p && (r += " if (" + _ + ") { ", h += "}");
          }
        }
    }
    return p && (r += " " + h + " if (" + b + " == errors) {"), r;
  }), Jt;
}
var Bt, Es;
function fl() {
  return Es || (Es = 1, Bt = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = "errs__" + s, c = e.util.copy(e), h = "";
    c.level++;
    var _ = "valid" + c.level;
    if (r += "var " + b + " = errors;", e.opts.strictKeywords ? typeof i == "object" && Object.keys(i).length > 0 || i === !1 : e.util.schemaHasRules(i, e.RULES.all)) {
      c.schema = i, c.schemaPath = u, c.errSchemaPath = f;
      var g = "key" + s, E = "idx" + s, j = "i" + s, T = "' + " + g + " + '", P = c.dataLevel = e.dataLevel + 1, x = "data" + P, $ = "dataProperties" + s, A = e.opts.ownProperties, k = e.baseId;
      A && (r += " var " + $ + " = undefined; "), A ? r += " " + $ + " = " + $ + " || Object.keys(" + m + "); for (var " + E + "=0; " + E + "<" + $ + ".length; " + E + "++) { var " + g + " = " + $ + "[" + E + "]; " : r += " for (var " + g + " in " + m + ") { ", r += " var startErrs" + s + " = errors; ";
      var C = g, S = e.compositeRule;
      e.compositeRule = c.compositeRule = !0;
      var R = e.validate(c);
      c.baseId = k, e.util.varOccurences(R, x) < 2 ? r += " " + e.util.varReplace(R, x, C) + " " : r += " var " + x + " = " + C + "; " + R + " ", e.compositeRule = c.compositeRule = S, r += " if (!" + _ + ") { for (var " + j + "=startErrs" + s + "; " + j + "<errors; " + j + "++) { vErrors[" + j + "].propertyName = " + g + "; }   var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'propertyNames' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { propertyName: '" + T + "' } ", e.opts.messages !== !1 && (r += " , message: 'property name \\'" + T + "\\' is invalid' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && p && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; "), p && (r += " break; "), r += " } }";
    }
    return p && (r += " " + h + " if (" + b + " == errors) {"), r;
  }), Bt;
}
var Kt, Ss;
function hl() {
  return Ss || (Ss = 1, Kt = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = "valid" + s, c = e.opts.$data && i && i.$data;
    c && (r += " var schema" + s + " = " + e.util.getData(i.$data, l, e.dataPathArr) + "; ");
    var h = "schema" + s;
    if (!c)
      if (i.length < e.opts.loopRequired && e.schema.properties && Object.keys(e.schema.properties).length) {
        var _ = [], g = i;
        if (g)
          for (var E, j = -1, T = g.length - 1; j < T; ) {
            E = g[j += 1];
            var P = e.schema.properties[E];
            P && (e.opts.strictKeywords ? typeof P == "object" && Object.keys(P).length > 0 || P === !1 : e.util.schemaHasRules(P, e.RULES.all)) || (_[_.length] = E);
          }
      } else
        var _ = i;
    if (c || _.length) {
      var x = e.errorPath, $ = c || _.length >= e.opts.loopRequired, A = e.opts.ownProperties;
      if (p)
        if (r += " var missing" + s + "; ", $) {
          c || (r += " var " + h + " = validate.schema" + u + "; ");
          var k = "i" + s, C = "schema" + s + "[" + k + "]", S = "' + " + C + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(x, C, e.opts.jsonPointers)), r += " var " + b + " = true; ", c && (r += " if (schema" + s + " === undefined) " + b + " = true; else if (!Array.isArray(schema" + s + ")) " + b + " = false; else {"), r += " for (var " + k + " = 0; " + k + " < " + h + ".length; " + k + "++) { " + b + " = " + m + "[" + h + "[" + k + "]] !== undefined ", A && (r += " &&   Object.prototype.hasOwnProperty.call(" + m + ", " + h + "[" + k + "]) "), r += "; if (!" + b + ") break; } ", c && (r += "  }  "), r += "  if (!" + b + ") {   ";
          var R = R || [];
          R.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { missingProperty: '" + S + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + S + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
          var D = r;
          r = R.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + D + "]); " : r += " validate.errors = [" + D + "]; return false; " : r += " var err = " + D + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ";
        } else {
          r += " if ( ";
          var L = _;
          if (L)
            for (var M, k = -1, J = L.length - 1; k < J; ) {
              M = L[k += 1], k && (r += " || ");
              var te = e.util.getProperty(M), Q = m + te;
              r += " ( ( " + Q + " === undefined ", A && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(M) + "') "), r += ") && (missing" + s + " = " + e.util.toQuotedString(e.opts.jsonPointers ? M : te) + ") ) ";
            }
          r += ") {  ";
          var C = "missing" + s, S = "' + " + C + " + '";
          e.opts._errorDataPathProperty && (e.errorPath = e.opts.jsonPointers ? e.util.getPathExpr(x, C, !0) : x + " + " + C);
          var R = R || [];
          R.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { missingProperty: '" + S + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + S + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
          var D = r;
          r = R.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + D + "]); " : r += " validate.errors = [" + D + "]; return false; " : r += " var err = " + D + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } else { ";
        }
      else if ($) {
        c || (r += " var " + h + " = validate.schema" + u + "; ");
        var k = "i" + s, C = "schema" + s + "[" + k + "]", S = "' + " + C + " + '";
        e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(x, C, e.opts.jsonPointers)), c && (r += " if (" + h + " && !Array.isArray(" + h + ")) {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { missingProperty: '" + S + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + S + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } else if (" + h + " !== undefined) { "), r += " for (var " + k + " = 0; " + k + " < " + h + ".length; " + k + "++) { if (" + m + "[" + h + "[" + k + "]] === undefined ", A && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", " + h + "[" + k + "]) "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { missingProperty: '" + S + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + S + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } } ", c && (r += "  }  ");
      } else {
        var ie = _;
        if (ie)
          for (var M, X = -1, ee = ie.length - 1; X < ee; ) {
            M = ie[X += 1];
            var te = e.util.getProperty(M), S = e.util.escapeQuotes(M), Q = m + te;
            e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(x, M, e.opts.jsonPointers)), r += " if ( " + Q + " === undefined ", A && (r += " || ! Object.prototype.hasOwnProperty.call(" + m + ", '" + e.util.escapeQuotes(M) + "') "), r += ") {  var err =   ", e.createErrors !== !1 ? (r += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { missingProperty: '" + S + "' } ", e.opts.messages !== !1 && (r += " , message: '", e.opts._errorDataPathProperty ? r += "is a required property" : r += "should have required property \\'" + S + "\\'", r += "' "), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ";
          }
      }
      e.errorPath = x;
    } else p && (r += " if (true) {");
    return r;
  }), Kt;
}
var Qt, ws;
function pl() {
  return ws || (ws = 1, Qt = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m = "data" + (l || ""), b = "valid" + s, c = e.opts.$data && i && i.$data, h;
    if (c ? (r += " var schema" + s + " = " + e.util.getData(i.$data, l, e.dataPathArr) + "; ", h = "schema" + s) : h = i, (i || c) && e.opts.uniqueItems !== !1) {
      c && (r += " var " + b + "; if (" + h + " === false || " + h + " === undefined) " + b + " = true; else if (typeof " + h + " != 'boolean') " + b + " = false; else { "), r += " var i = " + m + ".length , " + b + " = true , j; if (i > 1) { ";
      var _ = e.schema.items && e.schema.items.type, g = Array.isArray(_);
      if (!_ || _ == "object" || _ == "array" || g && (_.indexOf("object") >= 0 || _.indexOf("array") >= 0))
        r += " outer: for (;i--;) { for (j = i; j--;) { if (equal(" + m + "[i], " + m + "[j])) { " + b + " = false; break outer; } } } ";
      else {
        r += " var itemIndices = {}, item; for (;i--;) { var item = " + m + "[i]; ";
        var E = "checkDataType" + (g ? "s" : "");
        r += " if (" + e.util[E](_, "item", e.opts.strictNumbers, !0) + ") continue; ", g && (r += ` if (typeof item == 'string') item = '"' + item; `), r += " if (typeof itemIndices[item] == 'number') { " + b + " = false; j = itemIndices[item]; break; } itemIndices[item] = i; } ";
      }
      r += " } ", c && (r += "  }  "), r += " if (!" + b + ") {   ";
      var j = j || [];
      j.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: 'uniqueItems' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { i: i, j: j } ", e.opts.messages !== !1 && (r += " , message: 'should NOT have duplicate items (items ## ' + j + ' and ' + i + ' are identical)' "), e.opts.verbose && (r += " , schema:  ", c ? r += "validate.schema" + u : r += "" + i, r += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + m + " "), r += " } ") : r += " {} ";
      var T = r;
      r = j.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + T + "]); " : r += " validate.errors = [" + T + "]; return false; " : r += " var err = " + T + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", r += " } ", p && (r += " else { ");
    } else
      p && (r += " if (true) { ");
    return r;
  }), Qt;
}
var Wt, xs;
function ml() {
  return xs || (xs = 1, Wt = {
    $ref: Wo(),
    allOf: Go(),
    anyOf: Yo(),
    $comment: Xo(),
    const: el(),
    contains: rl(),
    dependencies: tl(),
    enum: al(),
    format: sl(),
    if: nl(),
    items: il(),
    maximum: cs(),
    minimum: cs(),
    maxItems: fs(),
    minItems: fs(),
    maxLength: ps(),
    minLength: ps(),
    maxProperties: vs(),
    minProperties: vs(),
    multipleOf: ol(),
    not: ll(),
    oneOf: ul(),
    pattern: cl(),
    properties: dl(),
    propertyNames: fl(),
    required: hl(),
    uniqueItems: pl(),
    validate: mn()
  }), Wt;
}
var Gt, Rs;
function vl() {
  if (Rs) return Gt;
  Rs = 1;
  var n = ml(), e = xr().toHash;
  return Gt = function() {
    var a = [
      {
        type: "number",
        rules: [
          { maximum: ["exclusiveMaximum"] },
          { minimum: ["exclusiveMinimum"] },
          "multipleOf",
          "format"
        ]
      },
      {
        type: "string",
        rules: ["maxLength", "minLength", "pattern", "format"]
      },
      {
        type: "array",
        rules: ["maxItems", "minItems", "items", "contains", "uniqueItems"]
      },
      {
        type: "object",
        rules: [
          "maxProperties",
          "minProperties",
          "required",
          "dependencies",
          "propertyNames",
          { properties: ["additionalProperties", "patternProperties"] }
        ]
      },
      { rules: ["$ref", "const", "enum", "not", "anyOf", "oneOf", "allOf", "if"] }
    ], r = ["type", "$comment"], s = [
      "$schema",
      "$id",
      "id",
      "$data",
      "$async",
      "title",
      "description",
      "default",
      "definitions",
      "examples",
      "readOnly",
      "writeOnly",
      "contentMediaType",
      "contentEncoding",
      "additionalItems",
      "then",
      "else"
    ], l = ["number", "integer", "string", "array", "object", "boolean", "null"];
    return a.all = e(r), a.types = e(l), a.forEach(function(i) {
      i.rules = i.rules.map(function(u) {
        var f;
        if (typeof u == "object") {
          var p = Object.keys(u)[0];
          f = u[p], u = p, f.forEach(function(b) {
            r.push(b), a.all[b] = !0;
          });
        }
        r.push(u);
        var m = a.all[u] = {
          keyword: u,
          code: n[u],
          implements: f
        };
        return m;
      }), a.all.$comment = {
        keyword: "$comment",
        code: n.$comment
      }, i.type && (a.types[i.type] = i);
    }), a.keywords = e(r.concat(s)), a.custom = {}, a;
  }, Gt;
}
var Yt, Is;
function gl() {
  if (Is) return Yt;
  Is = 1;
  var n = [
    "multipleOf",
    "maximum",
    "exclusiveMaximum",
    "minimum",
    "exclusiveMinimum",
    "maxLength",
    "minLength",
    "pattern",
    "additionalItems",
    "maxItems",
    "minItems",
    "uniqueItems",
    "maxProperties",
    "minProperties",
    "required",
    "additionalProperties",
    "enum",
    "format",
    "const"
  ];
  return Yt = function(e, t) {
    for (var a = 0; a < t.length; a++) {
      e = JSON.parse(JSON.stringify(e));
      var r = t[a].split("/"), s = e, l;
      for (l = 1; l < r.length; l++)
        s = s[r[l]];
      for (l = 0; l < n.length; l++) {
        var i = n[l], u = s[i];
        u && (s[i] = {
          anyOf: [
            u,
            { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" }
          ]
        });
      }
    }
    return e;
  }, Yt;
}
var Xt, Os;
function yl() {
  if (Os) return Xt;
  Os = 1;
  var n = Pa().MissingRef;
  Xt = e;
  function e(t, a, r) {
    var s = this;
    if (typeof this._opts.loadSchema != "function")
      throw new Error("options.loadSchema should be a function");
    typeof a == "function" && (r = a, a = void 0);
    var l = i(t).then(function() {
      var f = s._addSchema(t, void 0, a);
      return f.validate || u(f);
    });
    return r && l.then(
      function(f) {
        r(null, f);
      },
      r
    ), l;
    function i(f) {
      var p = f.$schema;
      return p && !s.getSchema(p) ? e.call(s, { $ref: p }, !0) : Promise.resolve();
    }
    function u(f) {
      try {
        return s._compile(f);
      } catch (m) {
        if (m instanceof n) return p(m);
        throw m;
      }
      function p(m) {
        var b = m.missingSchema;
        if (_(b)) throw new Error("Schema " + b + " is loaded but " + m.missingRef + " cannot be resolved");
        var c = s._loadingSchemas[b];
        return c || (c = s._loadingSchemas[b] = s._opts.loadSchema(b), c.then(h, h)), c.then(function(g) {
          if (!_(b))
            return i(g).then(function() {
              _(b) || s.addSchema(g, b, void 0, a);
            });
        }).then(function() {
          return u(f);
        });
        function h() {
          delete s._loadingSchemas[b];
        }
        function _(g) {
          return s._refs[g] || s._schemas[g];
        }
      }
    }
  }
  return Xt;
}
var ea, $s;
function _l() {
  return $s || ($s = 1, ea = function(e, t, a) {
    var r = " ", s = e.level, l = e.dataLevel, i = e.schema[t], u = e.schemaPath + e.util.getProperty(t), f = e.errSchemaPath + "/" + t, p = !e.opts.allErrors, m, b = "data" + (l || ""), c = "valid" + s, h = "errs__" + s, _ = e.opts.$data && i && i.$data, g;
    _ ? (r += " var schema" + s + " = " + e.util.getData(i.$data, l, e.dataPathArr) + "; ", g = "schema" + s) : g = i;
    var E = this, j = "definition" + s, T = E.definition, P = "", x, $, A, k, C;
    if (_ && T.$data) {
      C = "keywordValidate" + s;
      var S = T.validateSchema;
      r += " var " + j + " = RULES.custom['" + t + "'].definition; var " + C + " = " + j + ".validate;";
    } else {
      if (k = e.useCustomRule(E, i, e.schema, e), !k) return;
      g = "validate.schema" + u, C = k.code, x = T.compile, $ = T.inline, A = T.macro;
    }
    var R = C + ".errors", D = "i" + s, L = "ruleErr" + s, M = T.async;
    if (M && !e.async) throw new Error("async keyword in sync schema");
    if ($ || A || (r += "" + R + " = null;"), r += "var " + h + " = errors;var " + c + ";", _ && T.$data && (P += "}", r += " if (" + g + " === undefined) { " + c + " = true; } else { ", S && (P += "}", r += " " + c + " = " + j + ".validateSchema(" + g + "); if (" + c + ") { ")), $)
      T.statements ? r += " " + k.validate + " " : r += " " + c + " = " + k.validate + "; ";
    else if (A) {
      var J = e.util.copy(e), P = "";
      J.level++;
      var te = "valid" + J.level;
      J.schema = k.validate, J.schemaPath = "";
      var Q = e.compositeRule;
      e.compositeRule = J.compositeRule = !0;
      var ie = e.validate(J).replace(/validate\.schema/g, C);
      e.compositeRule = J.compositeRule = Q, r += " " + ie;
    } else {
      var X = X || [];
      X.push(r), r = "", r += "  " + C + ".call( ", e.opts.passContext ? r += "this" : r += "self", x || T.schema === !1 ? r += " , " + b + " " : r += " , " + g + " , " + b + " , validate.schema" + e.schemaPath + " ", r += " , (dataPath || '')", e.errorPath != '""' && (r += " + " + e.errorPath);
      var ee = l ? "data" + (l - 1 || "") : "parentData", Ce = l ? e.dataPathArr[l] : "parentDataProperty";
      r += " , " + ee + " , " + Ce + " , rootData )  ";
      var Te = r;
      r = X.pop(), T.errors === !1 ? (r += " " + c + " = ", M && (r += "await "), r += "" + Te + "; ") : M ? (R = "customErrors" + s, r += " var " + R + " = null; try { " + c + " = await " + Te + "; } catch (e) { " + c + " = false; if (e instanceof ValidationError) " + R + " = e.errors; else throw e; } ") : r += " " + R + " = null; " + c + " = " + Te + "; ";
    }
    if (T.modifying && (r += " if (" + ee + ") " + b + " = " + ee + "[" + Ce + "];"), r += "" + P, T.valid)
      p && (r += " if (true) { ");
    else {
      r += " if ( ", T.valid === void 0 ? (r += " !", A ? r += "" + te : r += "" + c) : r += " " + !T.valid + " ", r += ") { ", m = E.keyword;
      var X = X || [];
      X.push(r), r = "";
      var X = X || [];
      X.push(r), r = "", e.createErrors !== !1 ? (r += " { keyword: '" + (m || "custom") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { keyword: '" + E.keyword + "' } ", e.opts.messages !== !1 && (r += ` , message: 'should pass "` + E.keyword + `" keyword validation' `), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + b + " "), r += " } ") : r += " {} ";
      var $e = r;
      r = X.pop(), !e.compositeRule && p ? e.async ? r += " throw new ValidationError([" + $e + "]); " : r += " validate.errors = [" + $e + "]; return false; " : r += " var err = " + $e + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
      var Ee = r;
      r = X.pop(), $ ? T.errors ? T.errors != "full" && (r += "  for (var " + D + "=" + h + "; " + D + "<errors; " + D + "++) { var " + L + " = vErrors[" + D + "]; if (" + L + ".dataPath === undefined) " + L + ".dataPath = (dataPath || '') + " + e.errorPath + "; if (" + L + ".schemaPath === undefined) { " + L + '.schemaPath = "' + f + '"; } ', e.opts.verbose && (r += " " + L + ".schema = " + g + "; " + L + ".data = " + b + "; "), r += " } ") : T.errors === !1 ? r += " " + Ee + " " : (r += " if (" + h + " == errors) { " + Ee + " } else {  for (var " + D + "=" + h + "; " + D + "<errors; " + D + "++) { var " + L + " = vErrors[" + D + "]; if (" + L + ".dataPath === undefined) " + L + ".dataPath = (dataPath || '') + " + e.errorPath + "; if (" + L + ".schemaPath === undefined) { " + L + '.schemaPath = "' + f + '"; } ', e.opts.verbose && (r += " " + L + ".schema = " + g + "; " + L + ".data = " + b + "; "), r += " } } ") : A ? (r += "   var err =   ", e.createErrors !== !1 ? (r += " { keyword: '" + (m || "custom") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(f) + " , params: { keyword: '" + E.keyword + "' } ", e.opts.messages !== !1 && (r += ` , message: 'should pass "` + E.keyword + `" keyword validation' `), e.opts.verbose && (r += " , schema: validate.schema" + u + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + b + " "), r += " } ") : r += " {} ", r += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && p && (e.async ? r += " throw new ValidationError(vErrors); " : r += " validate.errors = vErrors; return false; ")) : T.errors === !1 ? r += " " + Ee + " " : (r += " if (Array.isArray(" + R + ")) { if (vErrors === null) vErrors = " + R + "; else vErrors = vErrors.concat(" + R + "); errors = vErrors.length;  for (var " + D + "=" + h + "; " + D + "<errors; " + D + "++) { var " + L + " = vErrors[" + D + "]; if (" + L + ".dataPath === undefined) " + L + ".dataPath = (dataPath || '') + " + e.errorPath + ";  " + L + '.schemaPath = "' + f + '";  ', e.opts.verbose && (r += " " + L + ".schema = " + g + "; " + L + ".data = " + b + "; "), r += " } } else { " + Ee + " } "), r += " } ", p && (r += " else { ");
    }
    return r;
  }), ea;
}
const bl = "http://json-schema.org/draft-07/schema#", Pl = "http://json-schema.org/draft-07/schema#", El = "Core schema meta-schema", Sl = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, wl = ["object", "boolean"], xl = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, vn = {
  $schema: bl,
  $id: Pl,
  title: El,
  definitions: Sl,
  type: wl,
  properties: xl,
  default: !0
};
var ra, Ts;
function Rl() {
  if (Ts) return ra;
  Ts = 1;
  var n = vn;
  return ra = {
    $id: "https://github.com/ajv-validator/ajv/blob/master/lib/definition_schema.js",
    definitions: {
      simpleTypes: n.definitions.simpleTypes
    },
    type: "object",
    dependencies: {
      schema: ["validate"],
      $data: ["validate"],
      statements: ["inline"],
      valid: { not: { required: ["macro"] } }
    },
    properties: {
      type: n.properties.type,
      schema: { type: "boolean" },
      statements: { type: "boolean" },
      dependencies: {
        type: "array",
        items: { type: "string" }
      },
      metaSchema: { type: "object" },
      modifying: { type: "boolean" },
      valid: { type: "boolean" },
      $data: { type: "boolean" },
      async: { type: "boolean" },
      errors: {
        anyOf: [
          { type: "boolean" },
          { const: "full" }
        ]
      }
    }
  }, ra;
}
var ta, As;
function Il() {
  if (As) return ta;
  As = 1;
  var n = /^[a-z_$][a-z0-9_$-]*$/i, e = _l(), t = Rl();
  ta = {
    add: a,
    get: r,
    remove: s,
    validate: l
  };
  function a(i, u) {
    var f = this.RULES;
    if (f.keywords[i])
      throw new Error("Keyword " + i + " is already defined");
    if (!n.test(i))
      throw new Error("Keyword " + i + " is not a valid identifier");
    if (u) {
      this.validateKeyword(u, !0);
      var p = u.type;
      if (Array.isArray(p))
        for (var m = 0; m < p.length; m++)
          c(i, p[m], u);
      else
        c(i, p, u);
      var b = u.metaSchema;
      b && (u.$data && this._opts.$data && (b = {
        anyOf: [
          b,
          { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" }
        ]
      }), u.validateSchema = this.compile(b, !0));
    }
    f.keywords[i] = f.all[i] = !0;
    function c(h, _, g) {
      for (var E, j = 0; j < f.length; j++) {
        var T = f[j];
        if (T.type == _) {
          E = T;
          break;
        }
      }
      E || (E = { type: _, rules: [] }, f.push(E));
      var P = {
        keyword: h,
        definition: g,
        custom: !0,
        code: e,
        implements: g.implements
      };
      E.rules.push(P), f.custom[h] = P;
    }
    return this;
  }
  function r(i) {
    var u = this.RULES.custom[i];
    return u ? u.definition : this.RULES.keywords[i] || !1;
  }
  function s(i) {
    var u = this.RULES;
    delete u.keywords[i], delete u.all[i], delete u.custom[i];
    for (var f = 0; f < u.length; f++)
      for (var p = u[f].rules, m = 0; m < p.length; m++)
        if (p[m].keyword == i) {
          p.splice(m, 1);
          break;
        }
    return this;
  }
  function l(i, u) {
    l.errors = null;
    var f = this._validateKeyword = this._validateKeyword || this.compile(t, !0);
    if (f(i)) return !0;
    if (l.errors = f.errors, u)
      throw new Error("custom keyword definition is invalid: " + this.errorsText(f.errors));
    return !1;
  }
  return ta;
}
const Ol = "http://json-schema.org/draft-07/schema#", $l = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Tl = "Meta-schema for $data reference (JSON Schema extension proposal)", Al = "object", kl = ["$data"], Cl = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, jl = !1, Dl = {
  $schema: Ol,
  $id: $l,
  description: Tl,
  type: Al,
  required: kl,
  properties: Cl,
  additionalProperties: jl
};
var aa, ks;
function Nl() {
  if (ks) return aa;
  ks = 1;
  var n = Bo(), e = ba(), t = Ko(), a = hn(), r = pn(), s = Qo(), l = vl(), i = gl(), u = xr();
  aa = h, h.prototype.validate = _, h.prototype.compile = g, h.prototype.addSchema = E, h.prototype.addMetaSchema = j, h.prototype.validateSchema = T, h.prototype.getSchema = x, h.prototype.removeSchema = k, h.prototype.addFormat = Q, h.prototype.errorsText = te, h.prototype._addSchema = S, h.prototype._compile = R, h.prototype.compileAsync = yl();
  var f = Il();
  h.prototype.addKeyword = f.add, h.prototype.getKeyword = f.get, h.prototype.removeKeyword = f.remove, h.prototype.validateKeyword = f.validate;
  var p = Pa();
  h.ValidationError = p.Validation, h.MissingRefError = p.MissingRef, h.$dataMetaSchema = i;
  var m = "http://json-schema.org/draft-07/schema", b = ["removeAdditional", "useDefaults", "coerceTypes", "strictDefaults"], c = ["/properties"];
  function h(w) {
    if (!(this instanceof h)) return new h(w);
    w = this._opts = u.copy(w) || {}, Ee(this), this._schemas = {}, this._refs = {}, this._fragments = {}, this._formats = s(w.format), this._cache = w.cache || new t(), this._loadingSchemas = {}, this._compilations = [], this.RULES = l(), this._getId = D(w), w.loopRequired = w.loopRequired || 1 / 0, w.errorDataPath == "property" && (w._errorDataPathProperty = !0), w.serialize === void 0 && (w.serialize = r), this._metaOpts = $e(this), w.formats && ee(this), w.keywords && Ce(this), ie(this), typeof w.meta == "object" && this.addMetaSchema(w.meta), w.nullable && this.addKeyword("nullable", { metaSchema: { type: "boolean" } }), X(this);
  }
  function _(w, N) {
    var Z;
    if (typeof w == "string") {
      if (Z = this.getSchema(w), !Z) throw new Error('no schema with key or ref "' + w + '"');
    } else {
      var Y = this._addSchema(w);
      Z = Y.validate || this._compile(Y);
    }
    var F = Z(N);
    return Z.$async !== !0 && (this.errors = Z.errors), F;
  }
  function g(w, N) {
    var Z = this._addSchema(w, void 0, N);
    return Z.validate || this._compile(Z);
  }
  function E(w, N, Z, Y) {
    if (Array.isArray(w)) {
      for (var F = 0; F < w.length; F++) this.addSchema(w[F], void 0, Z, Y);
      return this;
    }
    var U = this._getId(w);
    if (U !== void 0 && typeof U != "string")
      throw new Error("schema id must be string");
    return N = e.normalizeId(N || U), Te(this, N), this._schemas[N] = this._addSchema(w, Z, Y, !0), this;
  }
  function j(w, N, Z) {
    return this.addSchema(w, N, Z, !0), this;
  }
  function T(w, N) {
    var Z = w.$schema;
    if (Z !== void 0 && typeof Z != "string")
      throw new Error("$schema must be a string");
    if (Z = Z || this._opts.defaultMeta || P(this), !Z)
      return this.logger.warn("meta-schema not available"), this.errors = null, !0;
    var Y = this.validate(Z, w);
    if (!Y && N) {
      var F = "schema is invalid: " + this.errorsText();
      if (this._opts.validateSchema == "log") this.logger.error(F);
      else throw new Error(F);
    }
    return Y;
  }
  function P(w) {
    var N = w._opts.meta;
    return w._opts.defaultMeta = typeof N == "object" ? w._getId(N) || N : w.getSchema(m) ? m : void 0, w._opts.defaultMeta;
  }
  function x(w) {
    var N = A(this, w);
    switch (typeof N) {
      case "object":
        return N.validate || this._compile(N);
      case "string":
        return this.getSchema(N);
      case "undefined":
        return $(this, w);
    }
  }
  function $(w, N) {
    var Z = e.schema.call(w, { schema: {} }, N);
    if (Z) {
      var Y = Z.schema, F = Z.root, U = Z.baseId, se = n.call(w, Y, F, void 0, U);
      return w._fragments[N] = new a({
        ref: N,
        fragment: !0,
        schema: Y,
        root: F,
        baseId: U,
        validate: se
      }), se;
    }
  }
  function A(w, N) {
    return N = e.normalizeId(N), w._schemas[N] || w._refs[N] || w._fragments[N];
  }
  function k(w) {
    if (w instanceof RegExp)
      return C(this, this._schemas, w), C(this, this._refs, w), this;
    switch (typeof w) {
      case "undefined":
        return C(this, this._schemas), C(this, this._refs), this._cache.clear(), this;
      case "string":
        var N = A(this, w);
        return N && this._cache.del(N.cacheKey), delete this._schemas[w], delete this._refs[w], this;
      case "object":
        var Z = this._opts.serialize, Y = Z ? Z(w) : w;
        this._cache.del(Y);
        var F = this._getId(w);
        F && (F = e.normalizeId(F), delete this._schemas[F], delete this._refs[F]);
    }
    return this;
  }
  function C(w, N, Z) {
    for (var Y in N) {
      var F = N[Y];
      !F.meta && (!Z || Z.test(Y)) && (w._cache.del(F.cacheKey), delete N[Y]);
    }
  }
  function S(w, N, Z, Y) {
    if (typeof w != "object" && typeof w != "boolean")
      throw new Error("schema should be object or boolean");
    var F = this._opts.serialize, U = F ? F(w) : w, se = this._cache.get(U);
    if (se) return se;
    Y = Y || this._opts.addUsedSchema !== !1;
    var le = e.normalizeId(this._getId(w));
    le && Y && Te(this, le);
    var oe = this._opts.validateSchema !== !1 && !N, ve;
    oe && !(ve = le && le == e.normalizeId(w.$schema)) && this.validateSchema(w, !0);
    var fe = e.ids.call(this, w), he = new a({
      id: le,
      schema: w,
      localRefs: fe,
      cacheKey: U,
      meta: Z
    });
    return le[0] != "#" && Y && (this._refs[le] = he), this._cache.put(U, he), oe && ve && this.validateSchema(w, !0), he;
  }
  function R(w, N) {
    if (w.compiling)
      return w.validate = F, F.schema = w.schema, F.errors = null, F.root = N || F, w.schema.$async === !0 && (F.$async = !0), F;
    w.compiling = !0;
    var Z;
    w.meta && (Z = this._opts, this._opts = this._metaOpts);
    var Y;
    try {
      Y = n.call(this, w.schema, N, w.localRefs);
    } catch (U) {
      throw delete w.validate, U;
    } finally {
      w.compiling = !1, w.meta && (this._opts = Z);
    }
    return w.validate = Y, w.refs = Y.refs, w.refVal = Y.refVal, w.root = Y.root, Y;
    function F() {
      var U = w.validate, se = U.apply(this, arguments);
      return F.errors = U.errors, se;
    }
  }
  function D(w) {
    switch (w.schemaId) {
      case "auto":
        return J;
      case "id":
        return L;
      default:
        return M;
    }
  }
  function L(w) {
    return w.$id && this.logger.warn("schema $id ignored", w.$id), w.id;
  }
  function M(w) {
    return w.id && this.logger.warn("schema id ignored", w.id), w.$id;
  }
  function J(w) {
    if (w.$id && w.id && w.$id != w.id)
      throw new Error("schema $id is different from id");
    return w.$id || w.id;
  }
  function te(w, N) {
    if (w = w || this.errors, !w) return "No errors";
    N = N || {};
    for (var Z = N.separator === void 0 ? ", " : N.separator, Y = N.dataVar === void 0 ? "data" : N.dataVar, F = "", U = 0; U < w.length; U++) {
      var se = w[U];
      se && (F += Y + se.dataPath + " " + se.message + Z);
    }
    return F.slice(0, -Z.length);
  }
  function Q(w, N) {
    return typeof N == "string" && (N = new RegExp(N)), this._formats[w] = N, this;
  }
  function ie(w) {
    var N;
    if (w._opts.$data && (N = Dl, w.addMetaSchema(N, N.$id, !0)), w._opts.meta !== !1) {
      var Z = vn;
      w._opts.$data && (Z = i(Z, c)), w.addMetaSchema(Z, m, !0), w._refs["http://json-schema.org/schema"] = m;
    }
  }
  function X(w) {
    var N = w._opts.schemas;
    if (N)
      if (Array.isArray(N)) w.addSchema(N);
      else for (var Z in N) w.addSchema(N[Z], Z);
  }
  function ee(w) {
    for (var N in w._opts.formats) {
      var Z = w._opts.formats[N];
      w.addFormat(N, Z);
    }
  }
  function Ce(w) {
    for (var N in w._opts.keywords) {
      var Z = w._opts.keywords[N];
      w.addKeyword(N, Z);
    }
  }
  function Te(w, N) {
    if (w._schemas[N] || w._refs[N])
      throw new Error('schema with key or id "' + N + '" already exists');
  }
  function $e(w) {
    for (var N = u.copy(w._opts), Z = 0; Z < b.length; Z++)
      delete N[b[Z]];
    return N;
  }
  function Ee(w) {
    var N = w._opts.logger;
    if (N === !1)
      w.logger = { log: Le, warn: Le, error: Le };
    else {
      if (N === void 0 && (N = console), !(typeof N == "object" && N.log && N.warn && N.error))
        throw new Error("logger must implement log, warn and error methods");
      w.logger = N;
    }
  }
  function Le() {
  }
  return aa;
}
var Fl = Nl();
const ql = /* @__PURE__ */ zo(Fl);
class Ll extends Mo {
  /**
   * Initializes this server with the given name and version information.
   */
  constructor(e, t) {
    var a;
    super(t), this._serverInfo = e, this._capabilities = (a = t?.capabilities) !== null && a !== void 0 ? a : {}, this._instructions = t?.instructions, this.setRequestHandler(Ys, (r) => this._oninitialize(r)), this.setNotificationHandler(Xs, () => {
      var r;
      return (r = this.oninitialized) === null || r === void 0 ? void 0 : r.call(this);
    });
  }
  /**
   * Registers new capabilities. This can only be called before connecting to a transport.
   *
   * The new capabilities will be merged with any existing capabilities previously given (e.g., at initialization).
   */
  registerCapabilities(e) {
    if (this.transport)
      throw new Error("Cannot register capabilities after connecting to transport");
    this._capabilities = Uo(this._capabilities, e);
  }
  assertCapabilityForMethod(e) {
    var t, a, r;
    switch (e) {
      case "sampling/createMessage":
        if (!(!((t = this._clientCapabilities) === null || t === void 0) && t.sampling))
          throw new Error(`Client does not support sampling (required for ${e})`);
        break;
      case "elicitation/create":
        if (!(!((a = this._clientCapabilities) === null || a === void 0) && a.elicitation))
          throw new Error(`Client does not support elicitation (required for ${e})`);
        break;
      case "roots/list":
        if (!(!((r = this._clientCapabilities) === null || r === void 0) && r.roots))
          throw new Error(`Client does not support listing roots (required for ${e})`);
        break;
    }
  }
  assertNotificationCapability(e) {
    switch (e) {
      case "notifications/message":
        if (!this._capabilities.logging)
          throw new Error(`Server does not support logging (required for ${e})`);
        break;
      case "notifications/resources/updated":
      case "notifications/resources/list_changed":
        if (!this._capabilities.resources)
          throw new Error(`Server does not support notifying about resources (required for ${e})`);
        break;
      case "notifications/tools/list_changed":
        if (!this._capabilities.tools)
          throw new Error(`Server does not support notifying of tool list changes (required for ${e})`);
        break;
      case "notifications/prompts/list_changed":
        if (!this._capabilities.prompts)
          throw new Error(`Server does not support notifying of prompt list changes (required for ${e})`);
        break;
    }
  }
  assertRequestHandlerCapability(e) {
    switch (e) {
      case "sampling/createMessage":
        if (!this._capabilities.sampling)
          throw new Error(`Server does not support sampling (required for ${e})`);
        break;
      case "logging/setLevel":
        if (!this._capabilities.logging)
          throw new Error(`Server does not support logging (required for ${e})`);
        break;
      case "prompts/get":
      case "prompts/list":
        if (!this._capabilities.prompts)
          throw new Error(`Server does not support prompts (required for ${e})`);
        break;
      case "resources/list":
      case "resources/templates/list":
      case "resources/read":
        if (!this._capabilities.resources)
          throw new Error(`Server does not support resources (required for ${e})`);
        break;
      case "tools/call":
      case "tools/list":
        if (!this._capabilities.tools)
          throw new Error(`Server does not support tools (required for ${e})`);
        break;
    }
  }
  async _oninitialize(e) {
    const t = e.params.protocolVersion;
    return this._clientCapabilities = e.params.capabilities, this._clientVersion = e.params.clientInfo, {
      protocolVersion: qi.includes(t) ? t : Vs,
      capabilities: this.getCapabilities(),
      serverInfo: this._serverInfo,
      ...this._instructions && { instructions: this._instructions }
    };
  }
  /**
   * After initialization has completed, this will be populated with the client's reported capabilities.
   */
  getClientCapabilities() {
    return this._clientCapabilities;
  }
  /**
   * After initialization has completed, this will be populated with information about the client's name and version.
   */
  getClientVersion() {
    return this._clientVersion;
  }
  getCapabilities() {
    return this._capabilities;
  }
  async ping() {
    return this.request({ method: "ping" }, fa);
  }
  async createMessage(e, t) {
    return this.request({ method: "sampling/createMessage", params: e }, cn, t);
  }
  async elicitInput(e, t) {
    const a = await this.request({ method: "elicitation/create", params: e }, dn, t);
    if (a.action === "accept" && a.content)
      try {
        const r = new ql(), s = r.compile(e.requestedSchema);
        if (!s(a.content))
          throw new Oe(Ie.InvalidParams, `Elicitation response content does not match requested schema: ${r.errorsText(s.errors)}`);
      } catch (r) {
        throw r instanceof Oe ? r : new Oe(Ie.InternalError, `Error validating elicitation response: ${r}`);
      }
    return a;
  }
  async listRoots(e, t) {
    return this.request({ method: "roots/list", params: e }, fn, t);
  }
  async sendLoggingMessage(e) {
    return this.notification({ method: "notifications/message", params: e });
  }
  async sendResourceUpdated(e) {
    return this.notification({
      method: "notifications/resources/updated",
      params: e
    });
  }
  async sendResourceListChanged() {
    return this.notification({
      method: "notifications/resources/list_changed"
    });
  }
  async sendToolListChanged() {
    return this.notification({ method: "notifications/tools/list_changed" });
  }
  async sendPromptListChanged() {
    return this.notification({ method: "notifications/prompts/list_changed" });
  }
}
class Ml {
  append(e) {
    this._buffer = this._buffer ? Buffer.concat([this._buffer, e]) : e;
  }
  readMessage() {
    if (!this._buffer)
      return null;
    const e = this._buffer.indexOf(`
`);
    if (e === -1)
      return null;
    const t = this._buffer.toString("utf8", 0, e).replace(/\r$/, "");
    return this._buffer = this._buffer.subarray(e + 1), Ul(t);
  }
  clear() {
    this._buffer = void 0;
  }
}
function Ul(n) {
  return Zi.parse(JSON.parse(n));
}
function zl(n) {
  return JSON.stringify(n) + `
`;
}
class Zl {
  constructor(e = ja.stdin, t = ja.stdout) {
    this._stdin = e, this._stdout = t, this._readBuffer = new Ml(), this._started = !1, this._ondata = (a) => {
      this._readBuffer.append(a), this.processReadBuffer();
    }, this._onerror = (a) => {
      var r;
      (r = this.onerror) === null || r === void 0 || r.call(this, a);
    };
  }
  /**
   * Starts listening for messages on stdin.
   */
  async start() {
    if (this._started)
      throw new Error("StdioServerTransport already started! If using Server class, note that connect() calls start() automatically.");
    this._started = !0, this._stdin.on("data", this._ondata), this._stdin.on("error", this._onerror);
  }
  processReadBuffer() {
    for (var e, t; ; )
      try {
        const a = this._readBuffer.readMessage();
        if (a === null)
          break;
        (e = this.onmessage) === null || e === void 0 || e.call(this, a);
      } catch (a) {
        (t = this.onerror) === null || t === void 0 || t.call(this, a);
      }
  }
  async close() {
    var e;
    this._stdin.off("data", this._ondata), this._stdin.off("error", this._onerror), this._stdin.listenerCount("data") === 0 && this._stdin.pause(), this._readBuffer.clear(), (e = this.onclose) === null || e === void 0 || e.call(this);
  }
  send(e) {
    return new Promise((t) => {
      const a = zl(e);
      this._stdout.write(a) ? t() : this._stdout.once("drain", t);
    });
  }
}
class gn {
  baseUrl;
  headers;
  constructor(e, t, a, r = "basic") {
    this.baseUrl = e.replace(/\/+$/, "");
    let s;
    r === "bearer" ? s = `Bearer ${a}` : s = `Basic ${Buffer.from(`${t}:${a}`).toString("base64")}`, this.headers = new Headers({
      Authorization: s,
      Accept: "application/json",
      "Content-Type": "application/json"
    });
  }
  async handleFetchError(e, t) {
    if (!e.ok) {
      let a = e.statusText, r = {};
      try {
        r = await e.json(), Array.isArray(r.errorMessages) && r.errorMessages.length > 0 ? a = r.errorMessages.join("; ") : r.message ? a = r.message : r.errorMessage && (a = r.errorMessage);
      } catch {
        console.warn("Could not parse JIRA error response body as JSON.");
      }
      const s = JSON.stringify(r, null, 2);
      console.error("JIRA API Error Details:", s);
      const l = a ? `: ${a}` : "";
      throw new Error(
        `JIRA API Error${l} (Status: ${e.status})`
      );
    }
    throw new Error("Unknown error occurred during fetch operation.");
  }
  /**
   * Extracts issue mentions from Atlassian document content
   * Looks for nodes that were auto-converted to issue links
   */
  extractIssueMentions(e, t, a) {
    const r = [], s = (l) => {
      if (l.type === "inlineCard" && l.attrs?.url) {
        const i = l.attrs.url.match(/\/browse\/([A-Z]+-\d+)/);
        i && r.push({
          key: i[1],
          type: "mention",
          source: t,
          commentId: a
        });
      }
      l.type === "text" && l.text && (l.text.match(/[A-Z]+-\d+/g) || []).forEach((u) => {
        r.push({
          key: u,
          type: "mention",
          source: t,
          commentId: a
        });
      }), l.content && l.content.forEach(s);
    };
    return e.forEach(s), [...new Map(r.map((l) => [l.key, l])).values()];
  }
  cleanComment(e) {
    const t = e.body?.content ? this.extractTextContent(e.body.content) : "", a = e.body?.content ? this.extractIssueMentions(e.body.content, "comment", e.id) : [];
    return {
      id: e.id,
      body: t,
      author: e.author?.displayName,
      created: e.created,
      updated: e.updated,
      mentions: a
    };
  }
  /**
   * Recursively extracts text content from Atlassian Document Format nodes
   */
  extractTextContent(e) {
    return Array.isArray(e) ? e.map((t) => t.type === "text" ? t.text || "" : t.content ? this.extractTextContent(t.content) : "").join("") : "";
  }
  cleanIssue(e) {
    const t = e.fields?.description?.content ? this.extractTextContent(e.fields.description.content) : "", a = {
      id: e.id,
      key: e.key,
      summary: e.fields?.summary,
      status: e.fields?.status?.name,
      created: e.fields?.created,
      updated: e.fields?.updated,
      description: t,
      relatedIssues: []
    };
    if (e.fields?.description?.content) {
      const r = this.extractIssueMentions(
        e.fields.description.content,
        "description"
      );
      r.length > 0 && (a.relatedIssues = r);
    }
    if (e.fields?.issuelinks?.length > 0) {
      const r = e.fields.issuelinks.map((s) => {
        const l = s.inwardIssue || s.outwardIssue, i = s.type.inward || s.type.outward;
        return {
          key: l.key,
          summary: l.fields?.summary,
          type: "link",
          relationship: i,
          source: "description"
        };
      });
      a.relatedIssues = [
        ...a.relatedIssues || [],
        ...r
      ];
    }
    return e.fields?.parent && (a.parent = {
      id: e.fields.parent.id,
      key: e.fields.parent.key,
      summary: e.fields.parent.fields?.summary
    }), e.fields?.customfield_10014 && (a.epicLink = {
      id: e.fields.customfield_10014,
      key: e.fields.customfield_10014,
      summary: void 0
    }), e.fields?.subtasks?.length > 0 && (a.children = e.fields.subtasks.map((r) => ({
      id: r.id,
      key: r.key,
      summary: r.fields?.summary
    }))), a;
  }
  async fetchJson(e, t) {
    const a = await fetch(this.baseUrl + e, {
      ...t,
      headers: this.headers
    });
    return a.ok || await this.handleFetchError(a, e), a.json();
  }
  async searchIssues(e) {
    const t = new URLSearchParams({
      jql: e,
      maxResults: "50",
      fields: [
        "id",
        "key",
        "summary",
        "description",
        "status",
        "created",
        "updated",
        "parent",
        "subtasks",
        "customfield_10014",
        "issuelinks"
      ].join(","),
      expand: "names,renderedFields"
    }), a = await this.fetchJson(`/rest/api/3/search/jql?${t}`);
    return {
      total: a.total,
      issues: a.issues.map((r) => this.cleanIssue(r))
    };
  }
  async getEpicChildren(e) {
    const t = new URLSearchParams({
      jql: `"Epic Link" = ${e}`,
      maxResults: "100",
      fields: [
        "id",
        "key",
        "summary",
        "description",
        "status",
        "created",
        "updated",
        "parent",
        "subtasks",
        "customfield_10014",
        "issuelinks"
      ].join(","),
      expand: "names,renderedFields"
    }), a = await this.fetchJson(`/rest/api/3/search/jql?${t}`);
    return await Promise.all(
      a.issues.map(async (s) => {
        const l = await this.fetchJson(
          `/rest/api/3/issue/${s.key}/comment`
        ), i = this.cleanIssue(s), u = l.comments.map(
          (p) => this.cleanComment(p)
        ), f = u.flatMap(
          (p) => p.mentions
        );
        return i.relatedIssues = [
          ...i.relatedIssues,
          ...f
        ], i.comments = u, i;
      })
    );
  }
  async getIssueWithComments(e) {
    const t = new URLSearchParams({
      fields: [
        "id",
        "key",
        "summary",
        "description",
        "status",
        "created",
        "updated",
        "parent",
        "subtasks",
        "customfield_10014",
        "issuelinks"
      ].join(","),
      expand: "names,renderedFields"
    });
    let a, r;
    try {
      [a, r] = await Promise.all([
        this.fetchJson(`/rest/api/3/issue/${e}?${t}`),
        this.fetchJson(`/rest/api/3/issue/${e}/comment`)
      ]);
    } catch (u) {
      throw u instanceof Error && u.message.includes("(Status: 404)") ? new Error(`Issue not found: ${e}`) : u;
    }
    const s = this.cleanIssue(a), l = r.comments.map(
      (u) => this.cleanComment(u)
    ), i = l.flatMap(
      (u) => u.mentions
    );
    if (s.relatedIssues = [...s.relatedIssues, ...i], s.comments = l, s.epicLink)
      try {
        const u = await this.fetchJson(
          `/rest/api/3/issue/${s.epicLink.key}?fields=summary`
        );
        s.epicLink.summary = u.fields?.summary;
      } catch (u) {
        console.error("Failed to fetch epic details:", u);
      }
    return s;
  }
  async createIssue(e, t, a, r, s) {
    const l = {
      fields: {
        project: {
          key: e
        },
        summary: a,
        issuetype: {
          name: t
        },
        ...r && { description: r },
        ...s
      }
    };
    return this.fetchJson("/rest/api/3/issue", {
      method: "POST",
      body: JSON.stringify(l)
    });
  }
  async updateIssue(e, t) {
    await this.fetchJson(`/rest/api/3/issue/${e}`, {
      method: "PUT",
      body: JSON.stringify({ fields: t })
    });
  }
  async getTransitions(e) {
    return (await this.fetchJson(
      `/rest/api/3/issue/${e}/transitions`
    )).transitions;
  }
  async transitionIssue(e, t, a) {
    const r = {
      transition: { id: t }
    };
    a && (r.update = {
      comment: [
        {
          add: {
            body: {
              type: "doc",
              version: 1,
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: a
                    }
                  ]
                }
              ]
            }
          }
        }
      ]
    }), await this.fetchJson(`/rest/api/3/issue/${e}/transitions`, {
      method: "POST",
      body: JSON.stringify(r)
    });
  }
  async addAttachment(e, t, a) {
    const r = new FormData();
    r.append("file", new Blob([t]), a);
    const s = new Headers(this.headers);
    s.delete("Content-Type"), s.set("X-Atlassian-Token", "no-check");
    const l = await fetch(
      `${this.baseUrl}/rest/api/3/issue/${e}/attachments`,
      {
        method: "POST",
        headers: s,
        body: r
      }
    );
    l.ok || await this.handleFetchError(l);
    const u = (await l.json())[0];
    return {
      id: u.id,
      filename: u.filename
    };
  }
  /**
   * Converts plain text to a basic Atlassian Document Format (ADF) structure.
   */
  createAdfFromBody(e) {
    return {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: e
            }
          ]
        }
      ]
    };
  }
  /**
   * Adds a comment to a JIRA issue.
   */
  async addCommentToIssue(e, t) {
    const r = {
      body: this.createAdfFromBody(t)
    }, s = await this.fetchJson(
      `/rest/api/3/issue/${e}/comment`,
      {
        method: "POST",
        body: JSON.stringify(r)
      }
    );
    return {
      id: s.id,
      author: s.author.displayName,
      created: s.created,
      updated: s.updated,
      body: this.extractTextContent(s.body.content)
    };
  }
}
class Vl extends gn {
  constructor(e, t, a, r = "basic") {
    super(e, t, a, r);
  }
  // Example: Override fetchJson to use /rest/api/2/ instead of /rest/api/3/
  overrideApiPath(e) {
    return e.replace("/rest/api/3/", "/rest/api/2/");
  }
  // Override fetchJson to use the correct API path
  async fetchJson(e, t) {
    const a = this.overrideApiPath(e);
    return super.fetchJson(a, t);
  }
  // You may need to override other methods for Jira Server quirks (e.g., ADF support, field names)
  // Add overrides here as needed
}
const la = process.env.JIRA_API_TOKEN, ua = process.env.JIRA_BASE_URL, ca = process.env.JIRA_USER_EMAIL, Hl = process.env.JIRA_TYPE === "server" ? "server" : "cloud", Cs = process.env.JIRA_AUTH_TYPE === "bearer" ? "bearer" : "basic";
if (!la || !ua || !ca)
  throw new Error(
    "JIRA_API_TOKEN, JIRA_USER_EMAIL and JIRA_BASE_URL environment variables are required"
  );
class Jl {
  server;
  jiraApi;
  constructor() {
    this.server = new Ll(
      {
        name: "jira-mcp",
        version: "0.2.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    ), Hl === "server" ? this.jiraApi = new Vl(
      ua,
      ca,
      la,
      Cs
    ) : this.jiraApi = new gn(
      ua,
      ca,
      la,
      Cs
    ), this.setupToolHandlers(), this.server.onerror = (e) => {
    }, process.on("SIGINT", async () => {
      await this.server.close(), process.exit(0);
    });
  }
  setupToolHandlers() {
    this.server.setRequestHandler(nn, async () => ({
      tools: [
        {
          name: "search_issues",
          description: "Search JIRA issues using JQL",
          inputSchema: {
            type: "object",
            properties: {
              searchString: {
                type: "string",
                description: "JQL search string"
              }
            },
            required: ["searchString"],
            additionalProperties: !1
          }
        },
        {
          name: "get_epic_children",
          description: "Get all child issues in an epic including their comments",
          inputSchema: {
            type: "object",
            properties: {
              epicKey: {
                type: "string",
                description: "The key of the epic issue"
              }
            },
            required: ["epicKey"],
            additionalProperties: !1
          }
        },
        {
          name: "get_issue",
          description: "Get detailed information about a specific JIRA issue including comments",
          inputSchema: {
            type: "object",
            properties: {
              issueId: {
                type: "string",
                description: "The ID or key of the JIRA issue"
              }
            },
            required: ["issueId"],
            additionalProperties: !1
          }
        },
        {
          name: "create_issue",
          description: "Create a new JIRA issue",
          inputSchema: {
            type: "object",
            properties: {
              projectKey: {
                type: "string",
                description: "The project key where the issue will be created"
              },
              issueType: {
                type: "string",
                description: 'The type of issue to create (e.g., "Bug", "Story", "Task")'
              },
              summary: {
                type: "string",
                description: "The issue summary/title"
              },
              description: {
                type: "string",
                description: "The issue description"
              },
              fields: {
                type: "object",
                description: "Additional fields to set on the issue",
                additionalProperties: !0
              }
            },
            required: ["projectKey", "issueType", "summary"],
            additionalProperties: !1
          }
        },
        {
          name: "update_issue",
          description: "Update an existing JIRA issue",
          inputSchema: {
            type: "object",
            properties: {
              issueKey: {
                type: "string",
                description: "The key of the issue to update"
              },
              fields: {
                type: "object",
                description: "Fields to update on the issue",
                additionalProperties: !0
              }
            },
            required: ["issueKey", "fields"],
            additionalProperties: !1
          }
        },
        {
          name: "get_transitions",
          description: "Get available status transitions for a JIRA issue",
          inputSchema: {
            type: "object",
            properties: {
              issueKey: {
                type: "string",
                description: "The key of the issue to get transitions for"
              }
            },
            required: ["issueKey"],
            additionalProperties: !1
          }
        },
        {
          name: "transition_issue",
          description: "Change the status of a JIRA issue by performing a transition",
          inputSchema: {
            type: "object",
            properties: {
              issueKey: {
                type: "string",
                description: "The key of the issue to transition"
              },
              transitionId: {
                type: "string",
                description: "The ID of the transition to perform"
              },
              comment: {
                type: "string",
                description: "Optional comment to add with the transition"
              }
            },
            required: ["issueKey", "transitionId"],
            additionalProperties: !1
          }
        },
        {
          name: "add_attachment",
          description: "Add a file attachment to a JIRA issue",
          inputSchema: {
            type: "object",
            properties: {
              issueKey: {
                type: "string",
                description: "The key of the issue to add attachment to"
              },
              fileContent: {
                type: "string",
                description: "Base64 encoded content of the file"
              },
              filename: {
                type: "string",
                description: "Name of the file to be attached"
              }
            },
            required: ["issueKey", "fileContent", "filename"],
            additionalProperties: !1
          }
        },
        {
          name: "add_comment",
          description: "Add a comment to a JIRA issue",
          inputSchema: {
            type: "object",
            properties: {
              issueIdOrKey: {
                type: "string",
                description: "The ID or key of the issue to add the comment to"
              },
              body: {
                type: "string",
                description: "The content of the comment (plain text)"
              }
            },
            required: ["issueIdOrKey", "body"],
            additionalProperties: !1
          }
        }
      ]
    })), this.server.setRequestHandler(ln, async (e) => {
      try {
        const t = e.params.arguments;
        switch (e.params.name) {
          case "search_issues": {
            if (!t.searchString || typeof t.searchString != "string")
              throw new Oe(
                Ie.InvalidParams,
                "Search string is required"
              );
            const a = await this.jiraApi.searchIssues(t.searchString);
            return {
              content: [
                { type: "text", text: JSON.stringify(a, null, 2) }
              ]
            };
          }
          case "get_epic_children": {
            if (!t.epicKey || typeof t.epicKey != "string")
              throw new Oe(
                Ie.InvalidParams,
                "Epic key is required"
              );
            const a = await this.jiraApi.getEpicChildren(t.epicKey);
            return {
              content: [
                { type: "text", text: JSON.stringify(a, null, 2) }
              ]
            };
          }
          case "get_issue": {
            if (!t.issueId || typeof t.issueId != "string")
              throw new Oe(
                Ie.InvalidParams,
                "Issue ID is required"
              );
            const a = await this.jiraApi.getIssueWithComments(
              t.issueId
            );
            return {
              content: [
                { type: "text", text: JSON.stringify(a, null, 2) }
              ]
            };
          }
          case "create_issue": {
            if (!t.projectKey || typeof t.projectKey != "string" || !t.issueType || typeof t.issueType != "string" || !t.summary || typeof t.summary != "string")
              throw new Oe(
                Ie.InvalidParams,
                "projectKey, issueType, and summary are required"
              );
            const a = await this.jiraApi.createIssue(
              t.projectKey,
              t.issueType,
              t.summary,
              t.description,
              t.fields
            );
            return {
              content: [
                { type: "text", text: JSON.stringify(a, null, 2) }
              ]
            };
          }
          case "update_issue": {
            if (!t.issueKey || typeof t.issueKey != "string" || !t.fields || typeof t.fields != "object")
              throw new Oe(
                Ie.InvalidParams,
                "issueKey and fields object are required"
              );
            return await this.jiraApi.updateIssue(t.issueKey, t.fields), {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    { message: `Issue ${t.issueKey} updated successfully` },
                    null,
                    2
                  )
                }
              ]
            };
          }
          case "get_transitions": {
            if (!t.issueKey || typeof t.issueKey != "string")
              throw new Oe(
                Ie.InvalidParams,
                "Issue key is required"
              );
            const a = await this.jiraApi.getTransitions(t.issueKey);
            return {
              content: [
                { type: "text", text: JSON.stringify(a, null, 2) }
              ]
            };
          }
          case "transition_issue": {
            if (!t.issueKey || typeof t.issueKey != "string" || !t.transitionId || typeof t.transitionId != "string")
              throw new Oe(
                Ie.InvalidParams,
                "issueKey and transitionId are required"
              );
            return await this.jiraApi.transitionIssue(
              t.issueKey,
              t.transitionId,
              t.comment
            ), {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      message: `Issue ${t.issueKey} transitioned successfully${t.comment ? " with comment" : ""}`
                    },
                    null,
                    2
                  )
                }
              ]
            };
          }
          case "add_attachment": {
            if (!t.issueKey || typeof t.issueKey != "string" || !t.fileContent || typeof t.fileContent != "string" || !t.filename || typeof t.filename != "string")
              throw new Oe(
                Ie.InvalidParams,
                "issueKey, fileContent, and filename are required"
              );
            const a = Buffer.from(t.fileContent, "base64"), r = await this.jiraApi.addAttachment(
              t.issueKey,
              a,
              t.filename
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      message: `File ${t.filename} attached successfully to issue ${t.issueKey}`,
                      attachmentId: r.id,
                      filename: r.filename
                    },
                    null,
                    2
                  )
                }
              ]
            };
          }
          case "add_comment": {
            if (!t.issueIdOrKey || typeof t.issueIdOrKey != "string" || !t.body || typeof t.body != "string")
              throw new Oe(
                Ie.InvalidParams,
                "issueIdOrKey and body are required"
              );
            const a = await this.jiraApi.addCommentToIssue(
              t.issueIdOrKey,
              t.body
            );
            return {
              content: [
                { type: "text", text: JSON.stringify(a, null, 2) }
              ]
            };
          }
          default:
            throw new Oe(
              Ie.MethodNotFound,
              `Unknown tool: ${e.params.name}`
            );
        }
      } catch (t) {
        throw t instanceof Oe ? t : new Oe(
          Ie.InternalError,
          t instanceof Error ? t.message : "Unknown error occurred"
        );
      }
    });
  }
  async run() {
    const e = new Zl();
    await this.server.connect(e);
  }
}
const Bl = new Jl();
Bl.run().catch(() => {
});
//# sourceMappingURL=index.js.map
