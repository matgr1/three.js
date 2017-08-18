import { ClampToEdgeWrapping, NearestFilter } from '../constants';
import { Texture } from './Texture';
import { ExtensibleTexture } from './ExtensibleTexture';

function Texture3D(data, width, height, depth, format, type, mapping, wrapS, wrapT, wrapR, magFilter, minFilter, anisotropy, encoding) {

    ExtensibleTexture.call(this, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

    this.image = { data: data, width: width, height: height, depth: depth };

    this.magFilter = magFilter !== undefined ? magFilter : NearestFilter;
    this.minFilter = minFilter !== undefined ? minFilter : NearestFilter;

    this.flipY = false;
    this.generateMipmaps = false;
    this.wrapR = wrapR !== undefined ? wrapR : ClampToEdgeWrapping;

}

Texture3D.prototype = Object.create(ExtensibleTexture.prototype);
Texture3D.prototype.constructor = Texture3D;

Texture3D.prototype.isTexture3D = true;

Texture3D.prototype.copy = function (source) {

    Texture.prototype.copy.call(this, source);
    this.wrapR = source.wrapR;
    return this;

}

Texture3D.prototype.getGlTarget = function (_gl) {

    return _gl.TEXTURE_3D;

}

Texture3D.prototype.upload = function (_gl, glTexture, utils) {

    _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, this.flipY ? 1 : 0);
    _gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha ? 1 : 0);
    _gl.pixelStorei(_gl.UNPACK_ALIGNMENT, this.unpackAlignment);

    var textureType = this.getGlTextureTarget(_gl);

    _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_S, utils.convert(this.wrapS));
    _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_T, utils.convert(this.wrapT));
    _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_R, utils.convert(this.wrapR));

    _gl.texParameteri(textureType, _gl.TEXTURE_MAG_FILTER, utils.convert(this.magFilter));
    _gl.texParameteri(textureType, _gl.TEXTURE_MIN_FILTER, utils.convert(this.minFilter));

    // TODO: anisotropy extension??? (see original THREE setTextureParameters in WebGLTextures.js)

    var glFormat = utils.convert(this.format);
    var glType = utils.convert(this.type);

    // use manually created mipmaps if available
    // if there are no manual mipmaps
    // set 0 level mipmap and then use GL to generate other mipmap levels

    if (this.mipmaps.length > 0) {

        // WebGL2 supports NPOT mipmapping 

        for (var i = 0, il = this.mipmaps.length; i < il; i++) {

            var mipmap = this.mipmaps[i];
            _gl.texImage3D(textureType, i, glFormat, mipmap.width, mipmap.height, mipmap.depth, 0, glFormat, glType, mipmap.data);

        }

        this.generateMipmaps = false;

    } else {

        _gl.texImage3D(textureType, 0, glFormat, this.image.width, this.image.height, this.image.depth, 0, glFormat, glType, this.image.data);

    }

}

export { Texture3D };