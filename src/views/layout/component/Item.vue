<script>
export default {
  name: 'MenuItemIcon',
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  render(_) {
    const { icon, title } = this || {};
    const vnodes = [];
    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />);
      } else {
        vnodes.push(<i class={[icon, 'sub-el-icon iconfont']} />);
      }
    }

    if (title) {
      vnodes.push(<span slot="title">{title}</span>);
    }
    return vnodes;
  },
};
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
