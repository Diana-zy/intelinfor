<template>
  <div class="page">
    <AppHeader />
    <main class="main">
      <div class="layout-left">
        <div v-if="loading" class="author-loading">
          <Loading />
        </div>
        <div v-else-if="author" class="author-card">
          <div class="avatar-wrap">
            <NuxtImg
              v-if="author.avatar"
              format="auto"
              fit="cover"
              width="80"
              height="80"
              :src="author.avatar"
              :alt="author.avatar_seo_alt || author.name"
              class="avatar-img"
            />
            <div v-else class="avatar-initial">{{ initial }}</div>
          </div>
          <div class="author-badge">AUTHOR &amp; EXPERT</div>
          <h1 class="author-name">{{ author.name }}</h1>
          <p class="author-intro">{{ author.intro }}</p>
          <a
            v-if="linkedin"
            :href="linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="linkedin-link"
          >LinkedIn</a>
        </div>
      </div>
      <div class="layout-right">
        <right-side-box />
      </div>
    </main>
    <footer-seo :info="{}" />
  </div>
</template>

<script>
import AppHeader from "../../components/Header";
import RightSideBox from "../../components/RightSideBox";
import FooterSeo from "../../components/FooterSeo";
import Loading from "../../components/Loading";
import { authorData } from "../../config/author-links";

export default {
  components: { AppHeader, RightSideBox, FooterSeo, Loading },
  data() {
    return {
      author: null,
      authorId: null,
      loading: true
    };
  },
  head() {
    if (!this.author) return {};
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: this.author.name,
      description: this.author.intro,
      image: `https://bunchthings.com/${this.author.avatar}`,
      url: `https://intelinfor.com/author/${this.$route.params.author}/`
    };
    if (this.linkedin) schema.sameAs = [this.linkedin];
    return {
      title: `${this.author.name} - Intelinfor`,
      meta: [
        { hid: "description", name: "description", content: this.author.intro },
        { hid: "og:title", property: "og:title", content: this.author.name },
        { hid: "og:description", property: "og:description", content: this.author.intro },
        {
          hid: "og:image",
          property: "og:image",
          content: `https://bunchthings.com/cdn-cgi/image/w=200,f=auto,fit=cover/${this.author.avatar}`
        }
      ],
      script: [{ type: "application/ld+json", json: schema }]
    };
  },
  computed: {
    initial() {
      return this.author?.name?.charAt(0).toUpperCase() || "A";
    },
    linkedin() {
      return authorData[this.authorId]?.linkedin || "";
    }
  },
  mounted() {
    const slug = this.$route.params.author;
    const lastDash = slug.lastIndexOf("-");
    const id = Number(slug.substring(lastDash + 1));
    this.authorId = id;
    const data = authorData[id];
    if (data && data.name) {
      this.author = data;
    }
    this.loading = false;
  }
};
</script>

<style lang="scss" scoped>
.author-loading {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.author-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  max-width: 480px;
  margin: 32px auto;
}

.avatar-wrap {
  margin-bottom: 16px;
}

.avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid $color1;
}

.avatar-initial {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #e8f4f8;
  border: 3px solid $color1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: $color1;
}

.author-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid $color1;
  color: $color1;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.author-name {
  font-size: 24px;
  font-weight: bold;
  color: $font3;
  margin-bottom: 12px;
}

.author-intro {
  font-size: 15px;
  line-height: 1.7;
  color: rgba($font3, 0.7);
  margin: 0 0 16px;
}

.linkedin-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: 20px;
  background: #0a66c2;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
  &:hover {
    background: #004182;
  }
}

@media screen and (max-width: 750px) {
  .author-card {
    margin: vw(32) auto;
    padding: vw(48) vw(32);
  }

  .avatar-img,
  .avatar-initial {
    width: vw(120);
    height: vw(120);
  }

  .avatar-initial {
    font-size: vw(48);
  }

  .author-name {
    font-size: vw(36);
  }

  .author-intro {
    font-size: vw(28);
  }
}
</style>
