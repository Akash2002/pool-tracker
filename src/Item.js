export default function Item(props) {
  return props.first ? (
    <div class="flex flex-row place-content-evenly space-x-4 bg-gray-700 p-4 rounded-2xl shadow-2xl">
      <div class="text-lg text-white"> {props.name} </div>
      <div class="text-lg text-white">
        {props.wins}/{props.losses}
      </div>
      <div class="text-lg text-white"> {props.trophies} </div>
    </div>
  ) : (
    <div class="flex flex-row place-content-evenly space-x-4 bg-blue-500 p-4 rounded-2xl shadow-2xl">
      <div class="text-lg text-white"> {props.name} </div>
      <div class="text-lg text-white">
        {props.wins}/{props.losses}
      </div>
      <div class="text-lg text-white"> {props.trophies} </div>
    </div>
  );
}
