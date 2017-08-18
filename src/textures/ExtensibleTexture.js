import { Texture } from './Texture';

function ExtensibleTexture(mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) {

    Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

}

ExtensibleTexture.prototype = Object.create(Texture.prototype);
ExtensibleTexture.prototype.constructor = ExtensibleTexture;

ExtensibleTexture.prototype.isExtensibleTexture = true;

ExtensibleTexture.prototype.getGlTarget = function (_gl) {

    throw new Error("No implementation found for getGlTarget");

}

ExtensibleTexture.prototype.upload = function (_gl, glTexture, utils) {

    throw new Error("No implementation found for upload");

}

export { ExtensibleTexture };