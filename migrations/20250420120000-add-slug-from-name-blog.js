const { default: slugify } = require("slugify");

module.exports = {
  async up(db, client) {
    const blogs = await db
      .collection('blogs')
      .find({})
      .toArray();

    for (const blog of blogs) {
      if (blog.name) {
        let baseSlug = slugify(blog.name, {
          lower: true,
          strict: true,
          remove: /[*+~.()'"!:@]/g
        });

        let slug = baseSlug;
        let counter = 1;
        while (
          await db.collection('blogs').findOne({
            slug,
            _id: { $ne: blog._id }
          })
        ) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        await db.collection('blogs').updateOne({ _id: blog._id }, { $set: { slug } });
      }
    }
  },

  async down(db, client) {
    await db.collection('blogs').updateMany({}, { $unset: { slug: '' } });
  }
};
