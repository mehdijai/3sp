<template>
  <Menu />
  <header class="page-header">
    <h1 class="page-title">About</h1>
  </header>
  <article class="page-content">
    <section class="section about">
      <h2 class="title">About 3SP demo</h2>
      <small class="caption">
        This version is a free demo, there will be a full version later
      </small>
      <div class="paragraph">
        <h3 class="title">Brief description</h3>
        <p class="content">
          3SP
          <span class="highlight">
            (<b>S</b>ave, <b>S</b>afe, <b>S</b>hare <b>P</b>asswords)
          </span>
          is a free desktop application where you can encrypt and store your
          private keys or password.
        </p>
      </div>
      <div class="paragraph">
        <h3 class="title">How is works</h3>
        <p class="content">
          The data you enter is encrypted and saved, it’s only decrypted when it
          is displayed on your screen. The app does not perform any network
          connection, it works on offline mode. With that being said, node data
          is send to a third-party. The data is kept inside the application.
        </p>
      </div>
      <div class="paragraph">
        <h3 class="title">Backup & share keys</h3>
        <p class="content">
          You can export all your keys on a <b>(.3sp)</b> file, And import it
          again. This way you can import your keys on an other device you own,
          or to share some keys with others
          <em>(Common keys with a team for example)</em> . However, you must
          login with the same password you used to export the keys, otherwise,
          the file won’t be imported.
        </p>
      </div>
    </section>
    <section class="section donation">
      <BMC />
    </section>
  </article>
</template>

<script>
import Menu from "../components/Menu.vue";
import BMC from "../components/BMC.vue";

export default {
  name: "About",
  components: {
    Menu,
    BMC,
  },
};
</script>

<style lang="sass" scoped>
@import "../sass/colors", "../sass/typography"
.page-header
  text-align: center
  margin-top: 3em
  .page-title
    color: $primary-dark
.page-content
  width: 450px
  margin: 3em auto
  .section
      background: $gray-lighter
      border-radius: 5px
      box-shadow: 0 10px 20px rgba($gray, 0.1)
      padding: 2em 3em
      &.about
        margin-bottom: 27px
        .title
          color: $primary
        .caption
          color: $primary-light
          font-size: $font-smaller
          font-weight: 500
        .paragraph
          margin-top: 1.5em
          .title
            color: $secondary
            font-size: $font-small
            margin-bottom: 0.3em
          .content
            font-size: $font-small
            .highlight
              color: $primary
            em
              font-weight: 500
</style>
