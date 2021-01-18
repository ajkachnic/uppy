import DashboardPlugin from '@uppy/dashboard'
import { shallowEqualObjects } from 'shallow-equal'
import { h as createElement } from 'vue'

export default {
  data () {
    return {
      plugin: {}
    }
  },
  props: {
    uppy: {
      required: true
    },
    props: {
      type: Object
    },
    plugins: {
      type: Array
    },
    open: {
      type: Boolean,
      required: true
    }
  },
  mounted () {
    this.installPlugin()
  },
  methods: {
    installPlugin () {
      const uppy = this.uppy
      const options = {
        id: 'vue:DashboardModal',
        plugins: this.plugins,
        ...this.props,
        target: this.$refs.container
      }
      uppy.use(DashboardPlugin, options)
      this.plugin = uppy.getPlugin(options.id)
      if (this.open) {
        this.plugin.openModal()
      }
    },
    uninstallPlugin (uppy) {
      uppy.removePlugin(this.plugin)
    }
  },
  beforeDestroy () {
    this.uninstallPlugin(this.uppy)
  },
  watch: {
    uppy (current, old) {
      if (old !== current) {
        this.uninstallPlugin(old)
        this.installPlugin()
      }
    },
    open (current, old) {
      if (current && !old) {
        this.plugin.openModal()
      }
      if (!current && old) {
        this.plugin.closeModal()
      }
    },
    props (current, old) {
      if (!shallowEqualObjects(current, old)) {
        this.plugin.setOptions({ ...current })
      }
    }
  },
  render () {
    // Hack to allow support for Vue 2 and 3
    if (arguments.length > 0 && typeof arguments[0] === 'function') {
      // TODO: Remove, for debugging purposes
      window.vueArgs = arguments

      // If it has arguments, then it's a Vue 2 app, and we handle it accordingly
      const [createElement] = arguments
      return createElement('div', {
        ref: 'container'
      })
    } else {
      // Other wise, we import the `h` function from the Vue package (in Vue 3 fashion)
      return createElement('div', {
        ref: 'container'
      })
    }
  }
}
