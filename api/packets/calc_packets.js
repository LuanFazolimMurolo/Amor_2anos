export default function packets_engine(data) {
  data.forEach((item) => {
    const { id, used, created_at } = item;

    console.log("ID:", id);
    console.log("USED:", used);
    console.log("CREATED_AT:", created_at);
  });
}