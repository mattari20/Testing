export const CV_BUILDER_LOCAL_STORE_VERSION='1.0.0';
const memory=new Map();
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
export function createCVBuilderLocalStore(options={}){
 const storage=options.storage||null,prefix=options.prefix||'estudent.cv.v2.';
 const key=name=>prefix+name;
 const read=name=>{const k=key(name);if(storage?.getItem){try{const raw=storage.getItem(k);return raw==null?null:JSON.parse(raw);}catch{return null;}}return clone(memory.get(k)||null);};
 const write=(name,value)=>{const k=key(name);const copy=clone(value);if(storage?.setItem){storage.setItem(k,JSON.stringify(copy));}else memory.set(k,copy);return copy;};
 const remove=name=>{const k=key(name);if(storage?.removeItem)storage.removeItem(k);else memory.delete(k);};
 return Object.freeze({version:CV_BUILDER_LOCAL_STORE_VERSION,read,write,remove,has:name=>read(name)!==null,clear:name=>remove(name)});
}