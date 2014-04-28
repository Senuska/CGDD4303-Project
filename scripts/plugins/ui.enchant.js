enchant.ui = {};
enchant.ui.Bar = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y) {
        enchant.Sprite.call(this, 1, 16);
        this.image = new enchant.Surface(1, 16);
        this.image.context.fillColor = 'RGB(0, 0, 256)';
        this.image.context.fillRect(0, 0, 1, 16);
        this._direction = 'right';
        this._origin = 0;
        this._maxvalue = enchant.Game.instance.width;
        this._lastvalue = 0;
        this.value = 0;
        this.easing = 5;
        switch (arguments.length) {
            case 2:
                this.y = y;
                this.x = x;
                this._origin = x;
                break;
            case 1:
                this.x = x;
                this._origin = x;
                break;
            default:
                break;
        }
        this.addEventListener('enterframe', function() {
            if (this.value < 0) {
                this.value = 0;
            }
            this._lastvalue += (this.value - this._lastvalue) / this.easing;
            if (Math.abs(this._lastvalue - this.value) < 1.3) {
                this._lastvalue = this.value;
            }
            this.width = (this._lastvalue) | 0;
            if (this.width > this._maxvalue) {
                this.width = this._maxvalue;
            }
            if (this._direction === 'left') {
                this._x = this._origin - this.width;
            } else {
                this._x = this._origin;
            }
            this._updateCoordinate();
        });
    },
    direction: {
        get: function() {
            return this._direction;
        },
        set: function(newdirection) {
            if (newdirection !== 'right' && newdirection !== 'left') {
                // ignore
            } else {
                this._direction = newdirection;
            }
        }
    },
    x: {
        get: function() {
            return this._origin;
        },
        set: function(x) {
            this._x = x;
            this._origin = x;
            this._dirty = true;
        }
    },
    maxvalue: {
        get: function() {
            return this._maxvalue;
        },
        set: function(val) {
            this._maxvalue = val;
        }
    }
});